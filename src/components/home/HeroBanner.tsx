'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, Sparkles, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { ShimmerButton } from '@/components/magicui/shimmer-button'

const slides = [
  {
    id: 0,
    bg: 'from-[#001C45] via-primary to-[#0086FF]',
    badge: { icon: <Sparkles className="w-3 h-3" />, text: 'Nova Coleção 2026' },
    title: (
      <>
        Vista-se com{' '}
        <br />
        <AnimatedGradientText colorFrom="#FFD600" colorMid="#ffffff" colorTo="#9DC4FF" speed={3}>
          Muito Estilo
        </AnimatedGradientText>
      </>
    ),
    subtitle: 'Roupas de qualidade premium para o dia a dia. Coleção nova toda semana com os melhores preços.',
    cta: { label: 'Ver coleção completa', href: '/produtos' },
    accent1: 'rgba(255,255,255,0.07)',
    accent2: 'rgba(245,166,35,0.1)',
  },
  {
    id: 1,
    bg: 'from-[#B03A00] via-[#FF6B00] to-[#FF9E3D]',
    badge: { icon: <span className="text-xs">🌞</span>, text: 'Coleção Verão' },
    title: (
      <>
        Looks frescos{' '}
        <br />
        <AnimatedGradientText colorFrom="#FFF9C4" colorMid="#ffffff" colorTo="#FFD600" speed={3}>
          para o verão
        </AnimatedGradientText>
      </>
    ),
    subtitle: 'Estilo e leveza para os dias quentes. Peças exclusivas da nova coleção verão 2026.',
    cta: { label: 'Ver coleção verão', href: '/categorias/vestidos' },
    accent1: 'rgba(255,255,255,0.1)',
    accent2: 'rgba(255,220,0,0.12)',
  },
  {
    id: 2,
    bg: 'from-[#2D0B5A] via-[#7B2D8B] to-[#A855C8]',
    badge: { icon: <Zap className="w-3 h-3" />, text: 'Oferta Especial' },
    title: (
      <>
        Até{' '}
        <AnimatedGradientText colorFrom="#FFD600" colorMid="#FF6B00" colorTo="#FFD600" speed={3}>
          50% OFF
        </AnimatedGradientText>
        <br />
        em toda loja
      </>
    ),
    subtitle: 'Promoções por tempo limitado. Aproveite os melhores descontos em peças selecionadas.',
    cta: { label: 'Ver promoções', href: '/produtos?ordenar=price_asc' },
    accent1: 'rgba(255,255,255,0.08)',
    accent2: 'rgba(255,107,0,0.12)',
  },
]

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
    title: (
      <>
        Até <span style={{ color: '#F5A623' }}>50% OFF</span>
      </>
    ),
    sub: 'Peças selecionadas',
    cta: 'Aproveitar',
  },
]

export function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [])
  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [paused, next])

  const slide = slides[current]

  return (
    <section className="flex flex-col gap-4 mb-6" aria-label="Destaques da loja">
      {/* Carousel */}
      <div
        className="relative overflow-hidden rounded-2xl min-h-[300px] lg:min-h-[360px] cursor-pointer"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className={`absolute inset-0 bg-gradient-to-br ${slide.bg} flex items-end p-8 sm:p-10`}
          >
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 75% 40%, ${slide.accent1} 0%, transparent 55%)`,
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 15% 85%, ${slide.accent2} 0%, transparent 40%)`,
                }}
              />
              <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-white/5 animate-pulse" />
              <div
                className="absolute top-16 right-16 w-20 h-20 rounded-full bg-yellow-400/10 animate-pulse"
                style={{ animationDelay: '1s' }}
              />
            </div>

            <div className="relative z-10 max-w-md">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                {slide.badge.icon}
                {slide.badge.text}
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-3">
                {slide.title}
              </h1>

              <p className="text-white/80 text-sm sm:text-base mb-6 max-w-[38ch]">
                {slide.subtitle}
              </p>

              <Link href={slide.cta.href}>
                <ShimmerButton
                  className="text-sm font-bold"
                  background="radial-gradient(ellipse 80% 50% at 50% 120%, #FF6B00, #E05A00)"
                  shimmerColor="#fff"
                >
                  {slide.cta.label}
                  <ArrowRight className="w-4 h-4" />
                </ShimmerButton>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next */}
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

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir para slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/45 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Side Cards — abaixo do carrossel, lado a lado */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sideCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`relative flex flex-col justify-end p-5 rounded-2xl overflow-hidden min-h-[110px] cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${card.bg}`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
            <div className="relative z-10">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-white/75 mb-0.5">
                {card.label}
              </p>
              <h3 className="font-display text-base font-bold text-white leading-snug">
                {card.title}
                <br />
                <span className="text-white/90 font-medium text-sm">{card.sub}</span>
              </h3>
              <span className="text-xs text-white/70 mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                {card.cta} <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
