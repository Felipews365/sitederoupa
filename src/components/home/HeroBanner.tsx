import { getActiveBanners } from '@/actions/admin/banners'
import { HeroBannerClient } from './HeroBannerClient'

// Slides de fallback usados quando o banco não retorna dados
const FALLBACK_SLIDES = [
  {
    id: 'fallback-1',
    title: 'Vista-se com',
    title_highlight: 'Muito Estilo',
    subtitle: 'Roupas de qualidade premium para o dia a dia. Coleção nova toda semana com os melhores preços.',
    badge_text: 'Nova Coleção 2026',
    cta_label: 'Ver coleção completa',
    cta_href: '/produtos',
    bg_from: '#001C45',
    bg_via: '#0064D2',
    bg_to: '#0086FF',
    image_url: null,
    banner_height: 500,
    cta_bg_color: '#FF6B00',
    template: 'gradient',
    image_position: null,
    sort_order: 0,
    active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-2',
    title: 'Looks frescos',
    title_highlight: 'para o verão',
    subtitle: 'Estilo e leveza para os dias quentes. Peças exclusivas da nova coleção verão 2026.',
    badge_text: 'Coleção Verão',
    cta_label: 'Ver coleção verão',
    cta_href: '/categorias/vestidos',
    bg_from: '#B03A00',
    bg_via: '#FF6B00',
    bg_to: '#FF9E3D',
    image_url: null,
    banner_height: 500,
    cta_bg_color: '#FF6B00',
    template: 'gradient',
    image_position: null,
    sort_order: 1,
    active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-3',
    title: 'Até',
    title_highlight: '50% OFF',
    subtitle: 'Promoções por tempo limitado. Aproveite os melhores descontos em peças selecionadas.',
    badge_text: 'Oferta Especial',
    cta_label: 'Ver promoções',
    cta_href: '/produtos?ordenar=price_asc',
    bg_from: '#2D0B5A',
    bg_via: '#7B2D8B',
    bg_to: '#A855C8',
    image_url: null,
    banner_height: 500,
    cta_bg_color: '#FF6B00',
    template: 'gradient',
    image_position: null,
    sort_order: 2,
    active: true,
    created_at: '',
    updated_at: '',
  },
]

export async function HeroBanner() {
  let slides: import('@/actions/admin/banners').HeroBanner[] = FALLBACK_SLIDES
  try {
    const dbSlides = await getActiveBanners()
    if (dbSlides.length > 0) slides = dbSlides
  } catch {
    // banco indisponível — usa fallback
  }

  return <HeroBannerClient slides={slides} />
}
