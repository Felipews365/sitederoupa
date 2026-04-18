'use server'

import { createClient } from '@/lib/supabase/server'
import type { ProductWithDetails } from '@/types/database'

export async function getFeaturedProducts(limit = 8): Promise<ProductWithDetails[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images(*),
      product_variants(*),
      categories(id, name, slug)
    `)
    .eq('active', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return (data as ProductWithDetails[]) ?? []
}

export async function getAvailableColors(): Promise<{ color: string; color_hex: string | null }[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('product_variants')
    .select('color, color_hex')
    .not('color', 'is', null)
    .gt('stock', 0)

  if (!data) return []

  const seen = new Set<string>()
  const unique: { color: string; color_hex: string | null }[] = []
  for (const row of data) {
    if (row.color && !seen.has(row.color)) {
      seen.add(row.color)
      unique.push({ color: row.color, color_hex: row.color_hex ?? null })
    }
  }
  return unique
}

export async function getProducts({
  categorySlug,
  search,
  sortBy = 'newest',
  page = 1,
  limit = 12,
  gender,
  minPrice,
  maxPrice,
  sizes,
  colors,
  onSale,
}: {
  categorySlug?: string
  search?: string
  sortBy?: string
  page?: number
  limit?: number
  gender?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  onSale?: boolean
} = {}): Promise<{ products: ProductWithDetails[]; total: number }> {
  const supabase = await createClient()

  // Filtrar por tamanho via subquery em product_variants
  let sizeFilterIds: string[] | null = null
  if (sizes && sizes.length > 0) {
    const { data: variantData } = await supabase
      .from('product_variants')
      .select('product_id')
      .in('size', sizes)
      .gt('stock', 0)
    sizeFilterIds = [...new Set((variantData ?? []).map((v) => v.product_id))]
    if (sizeFilterIds.length === 0) return { products: [], total: 0 }
  }

  // Filtrar por cor via subquery em product_variants
  let colorFilterIds: string[] | null = null
  if (colors && colors.length > 0) {
    const { data: variantData } = await supabase
      .from('product_variants')
      .select('product_id')
      .in('color', colors)
      .gt('stock', 0)
    colorFilterIds = [...new Set((variantData ?? []).map((v) => v.product_id))]
    if (colorFilterIds.length === 0) return { products: [], total: 0 }
  }

  let query = supabase
    .from('products')
    .select(
      `
      *,
      product_images(*),
      product_variants(*),
      categories!inner(id, name, slug)
    `,
      { count: 'exact' }
    )
    .eq('active', true)

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug)
  }

  if (search) {
    query = query.textSearch('fts', search, { config: 'portuguese' })
  }

  if (gender) {
    query = query.eq('gender', gender)
  }

  if (minPrice) {
    query = query.gte('price', minPrice)
  }

  if (maxPrice) {
    query = query.lte('price', maxPrice)
  }

  if (sizeFilterIds) {
    query = query.in('id', sizeFilterIds)
  }

  if (colorFilterIds) {
    query = query.in('id', colorFilterIds)
  }

  if (onSale) {
    query = query.not('compare_price', 'is', null)
  }

  switch (sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'name_asc':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0 }
  }

  return { products: (data as ProductWithDetails[]) ?? [], total: count ?? 0 }
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images(*),
      product_variants(*),
      categories(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error) return null
  return data as ProductWithDetails
}

export async function getCategories() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })

  return data ?? []
}

export async function searchProducts(query: string): Promise<ProductWithDetails[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select(`
      *,
      product_images(*),
      product_variants(*),
      categories(id, name, slug)
    `)
    .eq('active', true)
    .textSearch('fts', query, { config: 'portuguese' })
    .limit(20)

  return (data as ProductWithDetails[]) ?? []
}
