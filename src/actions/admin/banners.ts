'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface HeroBanner {
  id: string
  title: string
  title_highlight: string
  subtitle: string | null
  badge_text: string | null
  cta_label: string
  cta_href: string
  bg_from: string
  bg_via: string | null
  bg_to: string
  image_url: string | null
  banner_height: number
  cta_bg_color: string
  template: string
  image_position: string | null
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export type BannerFormData = Omit<HeroBanner, 'id' | 'created_at' | 'updated_at'>

export async function getAllBanners(): Promise<HeroBanner[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('hero_banners')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []) as HeroBanner[]
}

export async function getActiveBanners(): Promise<HeroBanner[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('hero_banners')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })
  return (data ?? []) as HeroBanner[]
}

export async function createBanner(
  input: BannerFormData
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('hero_banners').insert(input)
  if (error) return { error: error.message }
  revalidatePath('/admin/banners')
  revalidatePath('/')
  return { success: true }
}

export async function updateBanner(
  id: string,
  input: Partial<BannerFormData>
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('hero_banners').update(input).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/banners')
  revalidatePath('/')
  return { success: true }
}

export async function deleteBanner(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('hero_banners').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/banners')
  revalidatePath('/')
  return { success: true }
}

export async function reorderBanners(
  items: { id: string; sort_order: number }[]
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const updates = items.map(({ id, sort_order }) =>
    supabase.from('hero_banners').update({ sort_order }).eq('id', id)
  )
  await Promise.all(updates)
  revalidatePath('/admin/banners')
  revalidatePath('/')
  return { success: true }
}
