'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CartItem } from '@/store/cartStore'
import type { OrderWithItems } from '@/types/database'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants'

export async function getOrders(): Promise<OrderWithItems[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (data as OrderWithItems[]) ?? []
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  return (data as OrderWithItems) ?? null
}

export async function createOrder(
  cartItems: CartItem[],
  addressId: string,
  paymentMethod: 'pix' | 'credit_card' | 'boleto'
): Promise<{ success?: boolean; orderId?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Você precisa estar logado para finalizar a compra' }
  if (cartItems.length === 0) return { error: 'Carrinho vazio' }

  // Buscar endereço
  const { data: address } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', addressId)
    .eq('user_id', user.id)
    .single()

  if (!address) return { error: 'Endereço não encontrado' }

  // Validar estoque
  const variantIds = cartItems.map((i) => i.variantId)
  const { data: variants } = await supabase
    .from('product_variants')
    .select('id, stock')
    .in('id', variantIds)

  for (const item of cartItems) {
    const variant = variants?.find((v) => v.id === item.variantId)
    if (!variant || variant.stock < item.quantity) {
      return { error: `Estoque insuficiente para "${item.productName}"` }
    }
  }

  // Calcular totais
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shippingCost
  const pixKey = process.env.NEXT_PUBLIC_PIX_KEY ?? 'loja@email.com.br'

  // Criar pedido
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'pending',
      shipping_address: address,
      payment_method: paymentMethod,
      subtotal,
      shipping_cost: shippingCost,
      total,
      pix_key: pixKey,
    })
    .select()
    .single()

  if (orderError || !order) return { error: 'Erro ao criar pedido. Tente novamente.' }

  // Criar itens do pedido
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId,
    product_name: item.productName,
    product_image: item.productImage,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) return { error: 'Erro ao registrar itens do pedido.' }

  // Decrementar estoque
  for (const item of cartItems) {
    await supabase.rpc('decrement_stock', {
      variant_id: item.variantId,
      amount: item.quantity,
    })
  }

  revalidatePath('/pedidos')
  return { success: true, orderId: order.id }
}
