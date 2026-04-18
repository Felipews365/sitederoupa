import { getCategories } from '@/actions/products'
import { HeaderClient } from './HeaderClient'

export async function Header() {
  let categories: Awaited<ReturnType<typeof getCategories>> = []
  try {
    categories = await getCategories()
  } catch {
    // Supabase não configurado — sem categorias dinâmicas
  }
  return <HeaderClient categories={categories} />
}
