'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

export interface ProductFormData {
  name: string
  description?: string
  price: number
  compare_price?: number | null
  category_id?: string | null
  brand?: string
  material?: string
  gender?: 'masculino' | 'feminino' | 'unissex' | 'infantil' | null
  active: boolean
  featured: boolean
  sku?: string
  images: { url: string; alt_text?: string; is_primary: boolean; sort_order: number }[]
  variants: { size?: string; color?: string; color_hex?: string; stock: number; sku?: string }[]
}

export async function getAllProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, categories(name), product_images(url, is_primary), product_variants(id, stock)')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getProductForEdit(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*), categories(id, name)')
    .eq('id', id)
    .single()
  return data
}

export async function createProduct(
  formData: ProductFormData
): Promise<{ success?: boolean; id?: string; error?: string }> {
  const supabase = await createClient()

  const slug = slugify(formData.name)

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name: formData.name,
      slug,
      description: formData.description,
      price: formData.price,
      compare_price: formData.compare_price,
      category_id: formData.category_id,
      brand: formData.brand,
      material: formData.material,
      gender: formData.gender,
      active: formData.active,
      featured: formData.featured,
      sku: formData.sku,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Inserir imagens
  if (formData.images.length > 0) {
    await supabase.from('product_images').insert(
      formData.images.map((img) => ({ ...img, product_id: product.id }))
    )
  }

  // Inserir variantes
  if (formData.variants.length > 0) {
    await supabase.from('product_variants').insert(
      formData.variants.map((v) => ({ ...v, product_id: product.id }))
    )
  }

  revalidatePath('/admin/produtos')
  revalidatePath('/produtos')
  return { success: true, id: product.id }
}

export async function updateProduct(
  id: string,
  formData: ProductFormData
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .update({
      name: formData.name,
      description: formData.description,
      price: formData.price,
      compare_price: formData.compare_price,
      category_id: formData.category_id,
      brand: formData.brand,
      material: formData.material,
      gender: formData.gender,
      active: formData.active,
      featured: formData.featured,
      sku: formData.sku,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  // Substituir imagens
  await supabase.from('product_images').delete().eq('product_id', id)
  if (formData.images.length > 0) {
    await supabase.from('product_images').insert(
      formData.images.map((img) => ({ ...img, product_id: id }))
    )
  }

  // Substituir variantes
  await supabase.from('product_variants').delete().eq('product_id', id)
  if (formData.variants.length > 0) {
    await supabase.from('product_variants').insert(
      formData.variants.map((v) => ({ ...v, product_id: id }))
    )
  }

  revalidatePath('/admin/produtos')
  revalidatePath('/produtos')
  return { success: true }
}

export async function deleteProduct(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/produtos')
  revalidatePath('/produtos')
  return { success: true }
}

export async function toggleProductActive(id: string, active: boolean) {
  const supabase = await createClient()
  await supabase.from('products').update({ active }).eq('id', id)
  revalidatePath('/admin/produtos')
}
