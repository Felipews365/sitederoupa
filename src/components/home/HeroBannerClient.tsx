'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import type { HeroBanner } from '@/actions/admin/banners'

/** Clareia (amount > 0) ou escurece (amount < 0) uma cor hex */
function adjustHex(hex: string, amount: number): string {
  const clean = hex.replace('#', '')
  const adjust = (c: number) =>
    Math.min(255, Math.max(0, amount >= 0 ? Math.round(c + (255 - c) * amount) : Math.round(c * (1 + amount))))
  const r = adjust(parseInt(clean.slice(0, 2), 16))
  const g = adjust(parseInt(clean.slice(2, 4), 16))
  const b = adjust(parseInt(clean.slice(4, 6), 16))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

const sideCards = [
  {
    href: '/categorias/camisetas',
    bg: 'from-[#FF5C1A] to-[#FF8C42]',
    label: '🔥 Imperdível',
    title: 'Camisetas & Polos',
    sub: 'A partir de R$ 39',
    cta: 'Explorar',
  },
  {
    href: '/categorias/vestidos',
    bg: 'from-[#7B2D8B] to-[#A855C8]',
    label: '✨ Destaque',
    title: 'Vestidos',
    sub: 'Coleção Verão',
    cta: 'Ver modelos',
  },
  {
    href: '/produtos?ordenar=price_asc',
    bg: 'from-[#003F8A] to-[#001C45]',
    label: '⚡ Oferta',
    titleNode: (
      <>
        Até <span style={{ color: '#F5A623' }}>50% OFF</span>
      </>
    ),
    sub: 'Peças selecionadas',
    cta: 'Aproveitar',
  },
]

interface Props {
  slides: HeroBanner[]
}

export function HeroBannerClient({ slides }: Props) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const total = slides.length
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])

  useEffect(() => {
    if (paused || total <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next, total])

  if (total === 0) return null

  const slide = slides[current]

  const gradientStyle = slide.bg_via
    ? `linear-gradient(135deg, ${slide.bg_from}, ${slide.bg_via}, ${slide.bg_to})`
    : `linear-gradient(135deg, ${slide.bg_from}, ${slide.bg_to})`

  // Altura uniforme: usa o maior valor entre todos os slides
  const containerHeight = Math.max(...slides.map((s) => s.banner_height ?? 360))

  // Cores do botão do slide atual
  const btnBase  = slide.cta_bg_color ?? '#FF6B00'
  const btnDark  = adjustHex(btnBase, -0.15)   // fundo normal: base → mais escuro
  const btnLight = adjustHex(btnBase, 0.28)    // hover: mais claro → base

  return (
    <section className="flex flex-col gap-4 mb-6" aria-label="Destaques da loja">
      {/* Carousel */}
      <div
        style={{ height: `clamp(300px, 55vw, ${Math.max(containerHeight, 500)}px)` }}
        className="relative overflow-hidden rounded-2xl cursor-pointer"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center p-6 sm:p-10"
            style={{ background: gradientStyle }}
          >
            {/* Decorações */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(255,255,255,0.07)_0%,transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(245,166,35,0.08)_0%,transparent_40%)]" />
              {!slide.image_url && (
                <>
                  <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-white/5 animate-pulse" />
                  <div className="absolute top-16 right-16 w-20 h-20 rounded-full bg-yellow-400/10 animate-pulse" style={{ animationDelay: '1s' }} />
                </>
              )}
            </div>

            {/* Imagem do produto (quando existir) */}
            {slide.image_url && (
              <div className="absolute right-0 top-0 bottom-0 w-[42%] sm:w-[38%] pointer-events-none">
                {/* Gradiente de fade na esquerda da imagem */}
                <div
                  className="absolute inset-y-0 left-0 w-24 sm:w-20 z-10"
                  style={{ background: `linear-gradient(to right, ${slide.bg_via ?? slide.bg_from}, transparent)` }}
                />
                {/* Fade direita */}
                <div
                  className="absolute inset-y-0 right-0 w-16 sm:w-24 z-10"
                  style={{ background: `linear-gradient(to left, ${slide.bg_to}, transparent)` }}
                />
                <Image
                  src={slide.image_url}
                  alt={slide.title}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 42vw, 38vw"
                  priority
                />
              </div>
            )}

            <div className={`relative z-10 sm:w-[58%] ${slide.image_url ? 'w-[55%]' : 'w-full'}`}>
              {/* Badge */}
              {slide.badge_text && (
                <div className="inline-flex items-center gap-2 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  {slide.badge_text}
                </div>
              )}

              {/* Título */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                {slide.title}
                {slide.title_highlight && (
                  <>
                    {' '}
                    <br />
                    <AnimatedGradientText colorFrom="#FFD600" colorMid="#ffffff" colorTo="#9DC4FF" speed={3}>
                      {slide.title_highlight}
                    </AnimatedGradientText>
                  </>
                )}
              </h1>

              {slide.subtitle && (
                <p className="text-white/80 text-sm sm:text-base mb-5 sm:mb-6 max-w-[38ch] line-clamp-3 sm:line-clamp-none">
                  {slide.subtitle}
                </p>
              )}

              <Link href={slide.cta_href}>
                <ShimmerButton
                  className="text-sm font-bold"
                  background={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnBase}, ${btnDark})`}
                  hoverBackground={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnLight}, ${btnBase})`}
                  shimmerColor="#fff"
                >
                  {slide.cta_label}
                  <ArrowRight className="w-4 h-4" />
                </ShimmerButton>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Setas (só exibir se houver mais de 1 slide) */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Slide anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Próximo slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Ir para slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/45 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cards abaixo lado a lado */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {sideCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`relative flex flex-col justify-end p-3 sm:p-5 rounded-2xl overflow-hidden min-h-[90px] sm:min-h-[110px] cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${card.bg}`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
            <div className="relative z-10">
              <p className="text-[0.55rem] sm:text-[0.65rem] font-bold uppercase tracking-widest text-white/75 mb-0.5">
                {card.label}
              </p>
              <h3 className="font-display text-xs sm:text-base font-bold text-white leading-snug">
                {card.titleNode ?? card.title}
                <br />
                <span className="text-white/90 font-medium text-[0.65rem] sm:text-sm">{card.sub}</span>
              </h3>
              <span className="text-[0.6rem] sm:text-xs text-white/70 mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                {card.cta} <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
