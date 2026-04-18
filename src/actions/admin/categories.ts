'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'

export async function getAllCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  return data ?? []
}

export async function createCategory(input: {
  name: string
  description?: string
  sort_order?: number
}): Promise<{ category?: { id: string; name: string; slug: string }; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: input.name,
      slug: slugify(input.name),
      description: input.description,
      sort_order: input.sort_order ?? 0,
    })
    .select('id, name, slug')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/admin/categorias')
  revalidatePath('/')
  return { category: data }
}

export async function updateCategory(
  id: string,
  input: { name: string; description?: string; active: boolean; sort_order?: number; show_in_grid?: boolean }
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .update({
      name: input.name,
      description: input.description,
      active: input.active,
      sort_order: input.sort_order ?? 0,
      show_in_grid: input.show_in_grid ?? true,
    })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/categorias')
  revalidatePath('/')
  return { success: true }
}

export async function toggleCategoryGrid(
  id: string,
  show_in_grid: boolean
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').update({ show_in_grid }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/categorias')
  revalidatePath('/')
  return { success: true }
}

export async function deleteCategory(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/categorias')
  return { success: true }
}
