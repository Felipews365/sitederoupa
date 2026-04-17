'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { OrderStatus } from '@/types/database'

export async function getAllOrders() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, profiles(full_name), order_items(id)')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getAdminOrderById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*), profiles(full_name, phone, cpf)')
    .eq('id', id)
    .single()
  return data
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingCode?: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()

  const update: Record<string, string> = { status }
  if (trackingCode) update.tracking_code = trackingCode

  const { error } = await supabase.from('orders').update(update).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/pedidos')
  revalidatePath(`/admin/pedidos/${id}`)
  revalidatePath(`/pedidos/${id}`)
  return { success: true }
}

export async function getAdminStats() {
  const supabase = await createClient()

  const [orders, products, users] = await Promise.all([
    supabase.from('orders').select('total, status, created_at'),
    supabase.from('products').select('id, active'),
    supabase.from('profiles').select('id, role'),
  ])

  const totalOrders = orders.data?.length ?? 0
  const totalRevenue =
    orders.data
      ?.filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
      .reduce((sum, o) => sum + Number(o.total), 0) ?? 0

  const pendingOrders =
    orders.data?.filter((o) => o.status === 'pending').length ?? 0

  const totalProducts = products.data?.filter((p) => p.active).length ?? 0

  const totalCustomers =
    users.data?.filter((u) => u.role === 'customer').length ?? 0

  // Pedidos dos últimos 7 dias
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentOrders =
    orders.data?.filter((o) => new Date(o.created_at) > sevenDaysAgo).length ?? 0

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
  }
}
