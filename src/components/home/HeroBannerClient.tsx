'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import type { HeroBanner } from '@/actions/admin/banners'

function adjustHex(hex: string, amount: number): string {
  const clean = hex.replace('#', '')
  const adjust = (c: number) =>
    Math.min(255, Math.max(0, amount >= 0 ? Math.round(c + (255 - c) * amount) : Math.round(c * (1 + amount))))
  const r = adjust(parseInt(clean.slice(0, 2), 16))
  const g = adjust(parseInt(clean.slice(2, 4), 16))
  const b = adjust(parseInt(clean.slice(4, 6), 16))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/** Retorna se a foto fica no lado esquerdo, respeitando image_position ou o padrão do template */
function imgLeft(slide: HeroBanner): boolean {
  if (slide.image_position) return slide.image_position === 'left'
  return slide.template === 'diagonal' || slide.template === 'fashion' || slide.template === 'sale'
}

const sideCards = [
  { href: '/categorias/camisetas', bg: 'from-[#FF5C1A] to-[#FF8C42]', label: '🔥 Imperdível', title: 'Camisetas & Polos', sub: 'A partir de R$ 39', cta: 'Explorar' },
  { href: '/categorias/vestidos', bg: 'from-[#7B2D8B] to-[#A855C8]', label: '✨ Destaque', title: 'Vestidos', sub: 'Coleção Verão', cta: 'Ver modelos' },
  {
    href: '/produtos?ordenar=price_asc', bg: 'from-[#003F8A] to-[#001C45]', label: '⚡ Oferta',
    titleNode: (<>Até <span style={{ color: '#F5A623' }}>50% OFF</span></>),
    sub: 'Peças selecionadas', cta: 'Aproveitar',
  },
]

interface Props { slides: HeroBanner[] }

// ─── Template DIAGONAL ─────────────────────────────────────────────────────────
function DiagonalSlide({ slide }: { slide: HeroBanner }) {
  const btnBase = slide.cta_bg_color ?? '#FF6B00'
  const btnDark = adjustHex(btnBase, -0.15)
  const btnLight = adjustHex(btnBase, 0.28)
  const shapeGradient = slide.bg_via
    ? `linear-gradient(135deg, ${slide.bg_from}, ${slide.bg_via}, ${slide.bg_to})`
    : `linear-gradient(135deg, ${slide.bg_from}, ${slide.bg_to})`
  const photoLeft = imgLeft(slide)

  return (
    <div className="absolute inset-0 bg-white overflow-hidden">
      <div className="absolute inset-0">
        {photoLeft ? (
          <>
            {slide.image_url && (
              <div className="absolute inset-0 sm:inset-y-0 sm:right-auto sm:left-0 sm:w-[54%] sm:[clip-path:polygon(0_0,100%_0,82%_100%,0_100%)]">
                <Image src={slide.image_url} alt={slide.title} fill className="object-cover object-left sm:object-center" sizes="(max-width:640px) 100vw, 54vw" priority />
              </div>
            )}
            <div className="absolute inset-y-0 right-0 w-[60%] z-10"
              style={{ background: shapeGradient, clipPath: 'polygon(22% 0, 100% 0, 100% 100%, 0 100%)' }} />
            <div className="absolute inset-y-0 right-0 w-[52%] flex flex-col justify-center px-4 sm:px-8 lg:px-12 z-20">
              <TextContent slide={slide} btnBase={btnBase} btnDark={btnDark} btnLight={btnLight} />
            </div>
          </>
        ) : (
          <>
            {slide.image_url && (
              <div className="absolute inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[54%] sm:[clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]">
                <Image src={slide.image_url} alt={slide.title} fill className="object-cover object-right sm:object-center" sizes="(max-width:640px) 100vw, 54vw" priority />
              </div>
            )}
            <div className="absolute inset-y-0 left-0 w-[60%] z-10"
              style={{ background: shapeGradient, clipPath: 'polygon(0 0, 78% 0, 100% 100%, 0 100%)' }} />
            <div className="absolute inset-y-0 left-0 w-[52%] flex flex-col justify-center px-4 sm:px-8 lg:px-12 z-20">
              <TextContent slide={slide} btnBase={btnBase} btnDark={btnDark} btnLight={btnLight} />
            </div>
          </>
        )}
        {!slide.image_url && (
          <div className={`absolute inset-y-0 ${photoLeft ? 'left-0' : 'right-0'} w-[48%] flex items-center justify-center pointer-events-none`}>
            <div className="w-40 h-40 rounded-full border-4 border-gray-100 opacity-60" />
            <div className="absolute w-64 h-64 rounded-full border-2 border-gray-100 opacity-30" />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Template FASHION ──────────────────────────────────────────────────────────
function FashionSlide({ slide }: { slide: HeroBanner }) {
  const btnBase = slide.cta_bg_color ?? '#FF6B00'
  const btnDark = adjustHex(btnBase, -0.15)
  const btnLight = adjustHex(btnBase, 0.28)
  const shapeGradient = slide.bg_via
    ? `linear-gradient(150deg, ${slide.bg_from}, ${slide.bg_via}, ${slide.bg_to})`
    : `linear-gradient(150deg, ${slide.bg_from}, ${slide.bg_to})`
  const photoLeft = imgLeft(slide)

  const TextBlock = () => (
    <>
      {slide.title && <p className="text-white/65 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-2">{slide.title}</p>}
      <h1 className="font-display font-black text-white leading-none mb-4" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
        <AnimatedGradientText colorFrom="#FFD600" colorMid="#ffffff" colorTo="#9DC4FF" speed={3}>
          {slide.title_highlight || slide.title}
        </AnimatedGradientText>
      </h1>
      {slide.subtitle && <p className="text-white/75 text-sm sm:text-base mb-5 max-w-[30ch] line-clamp-2">{slide.subtitle}</p>}
      <Link href={slide.cta_href}>
        <ShimmerButton className="text-sm font-bold"
          background={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnBase}, ${btnDark})`}
          hoverBackground={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnLight}, ${btnBase})`}
          shimmerColor="#fff">
          {slide.cta_label}<ArrowRight className="w-4 h-4" />
        </ShimmerButton>
      </Link>
    </>
  )

  return (
    <div className="absolute inset-0 bg-[#f5f0ec] overflow-hidden">
      <div className="absolute inset-0">
        {photoLeft ? (
          <>
            <div className="absolute inset-y-0 right-0 w-[68%]"
              style={{ background: shapeGradient, clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)' }} />
            {slide.image_url && (
              <div className="absolute inset-y-0 left-0 w-[46%]">
                <Image src={slide.image_url} alt={slide.title} fill className="object-cover object-center" sizes="46vw" priority />
                <div className="absolute inset-y-0 right-0 w-16" style={{ background: `linear-gradient(to right, transparent, ${slide.bg_from})` }} />
              </div>
            )}
            {slide.badge_text && (
              <div className="absolute z-20 pointer-events-none" style={{ left: slide.image_url ? '43%' : '18%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-center p-2"
                  style={{ border: `3px solid ${adjustHex(slide.bg_from, 0.4)}` }}>
                  <Sparkles className="w-3 h-3 mb-0.5" style={{ color: slide.bg_from }} />
                  <span className="text-[0.5rem] sm:text-[0.55rem] lg:text-[0.6rem] font-black uppercase leading-tight" style={{ color: slide.bg_from }}>{slide.badge_text}</span>
                </div>
              </div>
            )}
            <div className="absolute inset-y-0 right-0 w-[56%] flex flex-col justify-center px-4 sm:px-8 lg:px-14 z-10"><TextBlock /></div>
          </>
        ) : (
          <>
            <div className="absolute inset-y-0 left-0 w-[68%]"
              style={{ background: shapeGradient, clipPath: 'polygon(0 0, 82% 0, 100% 100%, 0 100%)' }} />
            {slide.image_url && (
              <div className="absolute inset-y-0 right-0 w-[46%]">
                <Image src={slide.image_url} alt={slide.title} fill className="object-cover object-center" sizes="46vw" priority />
                <div className="absolute inset-y-0 left-0 w-16" style={{ background: `linear-gradient(to left, transparent, ${slide.bg_from})` }} />
              </div>
            )}
            {slide.badge_text && (
              <div className="absolute z-20 pointer-events-none" style={{ right: slide.image_url ? '43%' : '18%', top: '50%', transform: 'translate(50%, -50%)' }}>
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-center p-2"
                  style={{ border: `3px solid ${adjustHex(slide.bg_from, 0.4)}` }}>
                  <Sparkles className="w-3 h-3 mb-0.5" style={{ color: slide.bg_from }} />
                  <span className="text-[0.5rem] sm:text-[0.55rem] lg:text-[0.6rem] font-black uppercase leading-tight" style={{ color: slide.bg_from }}>{slide.badge_text}</span>
                </div>
              </div>
            )}
            <div className="absolute inset-y-0 left-0 w-[56%] flex flex-col justify-center px-4 sm:px-8 lg:px-14 z-10"><TextBlock /></div>
          </>
        )}
        {!slide.image_url && (
          <div className={`absolute inset-y-0 ${photoLeft ? 'left-0' : 'right-0'} w-[40%] flex items-center justify-center pointer-events-none`}>
            <div className="w-48 h-48 rounded-full border-4" style={{ borderColor: `${slide.bg_from}20` }} />
            <div className="absolute w-72 h-72 rounded-full border-2" style={{ borderColor: `${slide.bg_from}10` }} />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Template MAGAZINE ─────────────────────────────────────────────────────────
function MagazineSlide({ slide }: { slide: HeroBanner }) {
  const btnBase = slide.cta_bg_color ?? slide.bg_from
  const btnDark = adjustHex(btnBase, -0.15)
  const btnLight = adjustHex(btnBase, 0.28)
  const colorPanel = slide.bg_via
    ? `linear-gradient(160deg, ${slide.bg_from}, ${slide.bg_via}, ${slide.bg_to})`
    : `linear-gradient(160deg, ${slide.bg_from}, ${slide.bg_to})`
  const photoLeft = imgLeft(slide)

  const TextBlock = () => (
    <>
      {slide.badge_text && (
        <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-2" style={{ color: slide.bg_from }}>{slide.badge_text}</p>
      )}
      <h1 className="font-display font-black leading-none mb-2" style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)', color: slide.bg_from }}>
        {slide.title}
      </h1>
      {slide.title_highlight && (
        <p className="font-display font-bold leading-tight mb-3" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.5rem)' }}>
          <AnimatedGradientText colorFrom={slide.bg_from} colorMid={slide.bg_to} colorTo={slide.bg_from} speed={4}>
            {slide.title_highlight}
          </AnimatedGradientText>
        </p>
      )}
      {slide.subtitle && <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-[34ch] line-clamp-3">{slide.subtitle}</p>}
      <Link href={slide.cta_href}>
        <ShimmerButton className="text-sm font-bold"
          background={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnBase}, ${btnDark})`}
          hoverBackground={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnLight}, ${btnBase})`}
          shimmerColor="#fff">
          {slide.cta_label}<ArrowRight className="w-4 h-4" />
        </ShimmerButton>
      </Link>
    </>
  )

  return (
    <div className="absolute inset-0 bg-white overflow-hidden">
      <div className="absolute inset-0">
        {!photoLeft ? (
          <>
            <div className="absolute inset-y-0 right-0 w-[60%]"
              style={{ background: colorPanel, clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0 100%)' }} />
            {slide.image_url && (
              <div className="absolute inset-y-0 right-0 w-[57%] z-10"
                style={{ clipPath: 'polygon(17% 0, 100% 0, 100% 100%, 3% 100%)' }}>
                <Image src={slide.image_url} alt={slide.title} fill className="object-cover object-center" sizes="57vw" priority />
              </div>
            )}
            <div className="absolute inset-y-0 left-0 w-[50%] flex flex-col justify-center px-4 sm:px-8 lg:px-14 z-20"><TextBlock /></div>
          </>
        ) : (
          <>
            <div className="absolute inset-y-0 left-0 w-[60%]"
              style={{ background: colorPanel, clipPath: 'polygon(0 0, 86% 0, 100% 100%, 0 100%)' }} />
            {slide.image_url && (
              <div className="absolute inset-y-0 left-0 w-[57%] z-10"
                style={{ clipPath: 'polygon(0 0, 83% 0, 97% 100%, 0 100%)' }}>
                <Image src={slide.image_url} alt={slide.title} fill className="object-cover object-center" sizes="57vw" priority />
              </div>
            )}
            <div className="absolute inset-y-0 right-0 w-[50%] flex flex-col justify-center px-4 sm:px-8 lg:px-14 z-20"><TextBlock /></div>
          </>
        )}
        {!slide.image_url && (
          <div className={`absolute inset-y-0 ${!photoLeft ? 'right-0' : 'left-0'} w-[60%] flex items-center justify-center pointer-events-none z-20`}>
            <div className="w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute w-64 h-64 rounded-full bg-white/5" />
          </div>
        )}
      </div>
    </div>
  )
}

// Bloco de texto reutilizado pelo DiagonalSlide
function TextContent({ slide, btnBase, btnDark, btnLight }: { slide: HeroBanner; btnBase: string; btnDark: string; btnLight: string }) {
  return (
    <>
      {slide.badge_text && (
        <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider w-fit">
          <Sparkles className="w-3 h-3" />{slide.badge_text}
        </div>
      )}
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
        {slide.title}
        {slide.title_highlight && (
          <><br /><AnimatedGradientText colorFrom="#FFD600" colorMid="#ffffff" colorTo="#9DC4FF" speed={3}>{slide.title_highlight}</AnimatedGradientText></>
        )}
      </h1>
      {slide.subtitle && <p className="text-white/80 text-sm sm:text-base mb-5 sm:mb-6 max-w-[32ch] line-clamp-3">{slide.subtitle}</p>}
      <Link href={slide.cta_href}>
        <ShimmerButton className="text-sm font-bold"
          background={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnBase}, ${btnDark})`}
          hoverBackground={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnLight}, ${btnBase})`}
          shimmerColor="#fff">
          {slide.cta_label}<ArrowRight className="w-4 h-4" />
        </ShimmerButton>
      </Link>
    </>
  )
}

// ─── Template SPRING ──────────────────────────────────────────────────────────
function SpringSlide({ slide }: { slide: HeroBanner }) {
  const btnBase = slide.cta_bg_color ?? '#FF6B00'
  const btnDark = adjustHex(btnBase, -0.15)
  const btnLight = adjustHex(btnBase, 0.28)
  const shapeGradient = slide.bg_via
    ? `linear-gradient(150deg, ${slide.bg_from}, ${slide.bg_via}, ${slide.bg_to})`
    : `linear-gradient(150deg, ${slide.bg_from}, ${slide.bg_to})`
  const photoLeft = imgLeft(slide)

  return (
    <div className="absolute inset-0 bg-white overflow-hidden">
      <div className="absolute inset-0">
        {/* Forma diagonal colorida */}
        <div
          className={`absolute inset-y-0 ${photoLeft ? 'right-0' : 'left-0'} w-[55%]`}
          style={{ background: shapeGradient, clipPath: photoLeft ? 'polygon(22% 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 78% 0, 100% 100%, 0 100%)' }}
        />
        {/* Foto sobreposta na forma */}
        {slide.image_url && (
          <div
            className={`absolute inset-y-0 ${photoLeft ? 'right-0' : 'left-0'} w-[50%]`}
            style={{ clipPath: photoLeft ? 'polygon(25% 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 75% 0, 100% 100%, 0 100%)' }}
          >
            <Image src={slide.image_url} alt={slide.title} fill className="object-cover object-center" sizes="50vw" priority />
            {/* fade na borda interna */}
            <div className="absolute inset-y-0 w-20"
              style={{ [photoLeft ? 'left' : 'right']: 0, background: `linear-gradient(to ${photoLeft ? 'right' : 'left'}, ${slide.bg_from}, transparent)` }} />
          </div>
        )}
        {/* Badge circular GIRANTE */}
        {slide.badge_text && (
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{ [photoLeft ? 'right' : 'left']: '44%', top: '50%', transform: 'translate(50%, -50%)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-center p-2"
              style={{ border: `3px solid ${adjustHex(slide.bg_from, 0.3)}` }}
            >
              <Sparkles className="w-3 h-3 mb-0.5" style={{ color: slide.bg_from }} />
              <span className="text-[0.5rem] lg:text-[0.58rem] font-black uppercase leading-tight" style={{ color: slide.bg_from }}>{slide.badge_text}</span>
            </div>
          </motion.div>
        )}
        {/* Texto */}
        <div className={`absolute inset-y-0 ${photoLeft ? 'left-0' : 'right-0'} w-[48%] flex flex-col justify-center px-4 sm:px-8 lg:px-14 z-10`}>
          {slide.title && <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-2" style={{ color: slide.bg_from }}>{slide.title}</p>}
          <h1 className="font-display font-black leading-none mb-3" style={{ fontSize: 'clamp(1.8rem, 5.5vw, 5rem)', color: '#1a1a2e' }}>
            <AnimatedGradientText colorFrom={slide.bg_from} colorMid={slide.bg_via ?? slide.bg_to} colorTo={slide.bg_to} speed={4}>
              {slide.title_highlight || slide.title}
            </AnimatedGradientText>
          </h1>
          {slide.subtitle && <p className="text-gray-500 text-sm sm:text-base mb-5 max-w-[32ch] line-clamp-3">{slide.subtitle}</p>}
          <Link href={slide.cta_href}>
            <ShimmerButton className="text-sm font-bold"
              background={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnBase}, ${btnDark})`}
              hoverBackground={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnLight}, ${btnBase})`}
              shimmerColor="#fff">
              {slide.cta_label}<ArrowRight className="w-4 h-4" />
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Template SALE ─────────────────────────────────────────────────────────────
function SaleSlide({ slide }: { slide: HeroBanner }) {
  const btnBase = slide.cta_bg_color ?? '#FF6B00'
  const btnDark = adjustHex(btnBase, -0.15)
  const btnLight = adjustHex(btnBase, 0.28)
  const shapeGradient = slide.bg_via
    ? `linear-gradient(150deg, ${slide.bg_from}, ${slide.bg_via}, ${slide.bg_to})`
    : `linear-gradient(150deg, ${slide.bg_from}, ${slide.bg_to})`
  const photoLeft = imgLeft(slide)

  return (
    <div className="absolute inset-0 bg-white overflow-hidden">
      <div className="absolute inset-0">
        {/* Fundo colorido diagonal */}
        <div
          className={`absolute inset-y-0 ${photoLeft ? 'right-0' : 'left-0'} w-[58%]`}
          style={{ background: shapeGradient, clipPath: photoLeft ? 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 80% 0, 100% 100%, 0 100%)' }}
        />
        {/* Foto */}
        {slide.image_url && (
          <div
            className={`absolute inset-y-0 ${photoLeft ? 'left-0' : 'right-0'} w-[48%]`}
            style={{ clipPath: photoLeft ? 'polygon(0 0, 100% 0, 82% 100%, 0 100%)' : 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)' }}
          >
            <Image src={slide.image_url} alt={slide.title} fill className="object-cover object-center" sizes="48vw" priority />
          </div>
        )}
        {/* Badge circular PULSANTE no centro */}
        {slide.badge_text && (
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center text-center p-3"
              style={{ border: `4px solid ${adjustHex(slide.bg_from, 0.35)}` }}
            >
              <span className="text-[0.6rem] lg:text-[0.65rem] font-black uppercase leading-none mb-0.5" style={{ color: slide.bg_from }}>DISC.</span>
              <span className="font-black leading-none" style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)', color: slide.bg_from }}>{slide.badge_text}</span>
              <span className="text-[0.5rem] lg:text-[0.58rem] font-semibold uppercase" style={{ color: adjustHex(slide.bg_from, -0.1) }}>ALL ITEM</span>
            </div>
          </motion.div>
        )}
        {/* Texto */}
        <div className={`absolute inset-y-0 ${photoLeft ? 'right-0' : 'left-0'} w-[50%] flex flex-col justify-center px-4 sm:px-8 lg:px-14 z-10`}>
          {slide.title && <p className="text-white/70 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-2">{slide.title}</p>}
          <h1 className="font-display font-black text-white leading-none mb-4" style={{ fontSize: 'clamp(2rem, 7vw, 6rem)' }}>
            <AnimatedGradientText colorFrom="#FFD600" colorMid="#ffffff" colorTo="#9DC4FF" speed={3}>
              {slide.title_highlight || slide.title}
            </AnimatedGradientText>
          </h1>
          {slide.subtitle && <p className="text-white/75 text-sm sm:text-base mb-5 max-w-[28ch] line-clamp-2">{slide.subtitle}</p>}
          <Link href={slide.cta_href}>
            <ShimmerButton className="text-sm font-bold"
              background={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnBase}, ${btnDark})`}
              hoverBackground={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnLight}, ${btnBase})`}
              shimmerColor="#fff">
              {slide.cta_label}<ArrowRight className="w-4 h-4" />
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Template STRIPS ───────────────────────────────────────────────────────────
function StripsSlide({ slide }: { slide: HeroBanner }) {
  const btnBase = slide.cta_bg_color ?? '#FF6B00'
  const btnDark = adjustHex(btnBase, -0.15)
  const btnLight = adjustHex(btnBase, 0.28)
  const accentColor = slide.bg_from
  const stripGradient = slide.bg_via
    ? `linear-gradient(180deg, ${slide.bg_from}, ${slide.bg_via}, ${slide.bg_to})`
    : `linear-gradient(180deg, ${slide.bg_from}, ${slide.bg_to})`

  const strips = [
    { url: slide.image_url, clip: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)', delay: 0 },
    { url: slide.image_url_2, clip: 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)', delay: 0.1 },
    { url: slide.image_url_3, clip: 'polygon(12% 0, 100% 0, 100% 100%, 0 100%)', delay: 0.2 },
  ]

  return (
    <div className="absolute inset-0 bg-white overflow-hidden">
      <div className="flex absolute inset-0">
        {/* Texto esquerda */}
        <div className="relative z-10 w-[40%] flex flex-col justify-center px-4 sm:px-8 lg:px-14">
          {/* Linha de accent no topo */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accentColor }} />
          {slide.badge_text && (
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-3" style={{ color: accentColor }}>{slide.badge_text}</p>
          )}
          <h1 className="font-display font-black text-gray-900 leading-none mb-1" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 3.2rem)' }}>
            {slide.title}
          </h1>
          {slide.title_highlight && (
            <p className="font-script mb-4" style={{ fontSize: 'clamp(1.4rem, 4vw, 3.8rem)' }}>
              <AnimatedGradientText colorFrom={accentColor} colorMid={slide.bg_via ?? slide.bg_to} colorTo={slide.bg_to} speed={4}>
                {slide.title_highlight}
              </AnimatedGradientText>
            </p>
          )}
          {slide.subtitle && <p className="text-gray-500 text-sm mb-5 max-w-[30ch] line-clamp-3">{slide.subtitle}</p>}
          <Link href={slide.cta_href}>
            <ShimmerButton className="text-sm font-bold"
              background={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnBase}, ${btnDark})`}
              hoverBackground={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnLight}, ${btnBase})`}
              shimmerColor="#fff">
              {slide.cta_label}<ArrowRight className="w-4 h-4" />
            </ShimmerButton>
          </Link>
        </div>
        {/* Faixas diagonais direita */}
        <div className="absolute inset-y-0 right-0 w-[63%] flex">
          {strips.map((strip, i) => (
            <motion.div
              key={i}
              className="absolute inset-y-0"
              style={{
                left: `${i * 30}%`,
                width: '44%',
                clipPath: strip.clip,
              }}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.55, delay: strip.delay, ease: 'easeOut' }}
            >
              {strip.url
                ? <Image src={strip.url} alt={slide.title} fill className="object-cover object-center" sizes="25vw" priority={i === 0} />
                : <div className="absolute inset-0" style={{ background: stripGradient, opacity: 0.7 + i * 0.1 }} />}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Template DUO ──────────────────────────────────────────────────────────────
function DuoSlide({ slide }: { slide: HeroBanner }) {
  const btnBase = slide.cta_bg_color ?? '#FF6B00'
  const btnDark = adjustHex(btnBase, -0.15)
  const btnLight = adjustHex(btnBase, 0.28)
  const accentColor = slide.bg_from
  const bgLight = slide.bg_to ? `${slide.bg_to}18` : '#fef5f5'

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bgLight }}>
      <div className="absolute inset-0">
        {/* Duas fotos diagonais à esquerda */}
        {slide.image_url && (
          <motion.div
            className="absolute inset-y-0 left-0 w-[55%]"
            style={{ clipPath: 'polygon(0 0, 85% 0, 70% 100%, 0 100%)' }}
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Image src={slide.image_url} alt={slide.title} fill className="object-cover object-center" sizes="55vw" priority />
          </motion.div>
        )}
        {slide.image_url_2 && (
          <motion.div
            className="absolute inset-y-0 left-0 w-[55%]"
            style={{ clipPath: 'polygon(52% 0, 100% 0, 100% 100%, 37% 100%)' }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.12, ease: 'easeOut' }}
          >
            <Image src={slide.image_url_2} alt={slide.title} fill className="object-cover object-center" sizes="30vw" />
            {/* separador branco entre fotos */}
            <div className="absolute inset-y-0 left-0 w-2 bg-white" />
          </motion.div>
        )}
        {/* Badge no canto superior-esquerdo */}
        {slide.badge_text && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow text-xs font-black uppercase tracking-widest" style={{ color: accentColor }}>
              {slide.badge_text}
            </div>
          </div>
        )}
        {/* Tira de cor na borda inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: accentColor }} />
        {/* Texto direita */}
        <div className="absolute inset-y-0 right-0 w-[48%] flex flex-col justify-center px-4 sm:px-8 lg:px-14 z-10">
          {slide.title && <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-3" style={{ color: accentColor }}>{slide.title}</p>}
          <h1 className="font-display font-black leading-none mb-1" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)', color: '#1a1a2e' }}>
            {slide.title_highlight ? (
              <AnimatedGradientText colorFrom={accentColor} colorMid={slide.bg_via ?? slide.bg_to} colorTo={slide.bg_to} speed={4}>
                {slide.title}
              </AnimatedGradientText>
            ) : slide.title}
          </h1>
          {slide.title_highlight && (
            <p className="font-script mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)' }}>
              <AnimatedGradientText colorFrom={accentColor} colorMid={slide.bg_via ?? slide.bg_to} colorTo={slide.bg_to} speed={5}>
                {slide.title_highlight}
              </AnimatedGradientText>
            </p>
          )}
          {slide.subtitle && <p className="text-gray-500 text-sm mb-5 max-w-[30ch] line-clamp-3">{slide.subtitle}</p>}
          <Link href={slide.cta_href}>
            <ShimmerButton className="text-sm font-bold"
              background={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnBase}, ${btnDark})`}
              hoverBackground={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnLight}, ${btnBase})`}
              shimmerColor="#fff">
              {slide.cta_label}<ArrowRight className="w-4 h-4" />
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Carousel principal ────────────────────────────────────────────────────────
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

  // Altura = valor exato do banco (sem forçar mínimo de 500px)
  const containerHeight = Math.max(...slides.map((s) => s.banner_height ?? 360))

  const btnBase = slide.cta_bg_color ?? '#FF6B00'
  const btnDark = adjustHex(btnBase, -0.15)
  const btnLight = adjustHex(btnBase, 0.28)

  const isLightBg = ['diagonal', 'magazine', 'fashion', 'spring', 'sale', 'strips', 'duo'].includes(slide.template)

  return (
    <section className="flex flex-col gap-4 mb-2" aria-label="Destaques da loja">
      <div
        style={{ height: `clamp(240px, 55vw, ${containerHeight}px)` }}
        className="relative overflow-hidden rounded-2xl cursor-pointer min-h-[420px] sm:min-h-0"
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
            className="absolute inset-0"
          >
            {slide.template === 'diagonal' ? (
              <DiagonalSlide slide={slide} />
            ) : slide.template === 'fashion' ? (
              <FashionSlide slide={slide} />
            ) : slide.template === 'magazine' ? (
              <MagazineSlide slide={slide} />
            ) : slide.template === 'spring' ? (
              <SpringSlide slide={slide} />
            ) : slide.template === 'sale' ? (
              <SaleSlide slide={slide} />
            ) : slide.template === 'strips' ? (
              <StripsSlide slide={slide} />
            ) : slide.template === 'duo' ? (
              <DuoSlide slide={slide} />
            ) : (
              /* Gradiente (padrão) */
              <div className="absolute inset-0" style={{ background: gradientStyle }}>
              <div className="flex absolute inset-0 items-center p-5 sm:p-10">
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

                {/* Imagem — posição controlada por image_position */}
                {slide.image_url && (() => {
                  const photoLeft = imgLeft(slide)
                  return (
                    <div className={`absolute ${photoLeft ? 'left-0' : 'right-0'} top-0 bottom-0 w-[42%] sm:w-[38%] pointer-events-none`}>
                      {photoLeft ? (
                        <div className="absolute inset-y-0 right-0 w-24 sm:w-20 z-10"
                          style={{ background: `linear-gradient(to left, ${slide.bg_via ?? slide.bg_from}, transparent)` }} />
                      ) : (
                        <div className="absolute inset-y-0 left-0 w-24 sm:w-20 z-10"
                          style={{ background: `linear-gradient(to right, ${slide.bg_via ?? slide.bg_from}, transparent)` }} />
                      )}
                      <div className={`absolute inset-y-0 ${photoLeft ? 'left-0' : 'right-0'} w-16 sm:w-24 z-10`}
                        style={{ background: `linear-gradient(to ${photoLeft ? 'right' : 'left'}, ${photoLeft ? slide.bg_from : slide.bg_to}, transparent)` }} />
                      <Image src={slide.image_url} alt={slide.title} fill className="object-cover object-top"
                        sizes="(max-width: 640px) 42vw, 38vw" priority />
                    </div>
                  )
                })()}

                <div className={`relative z-10 sm:w-[58%] ${slide.image_url ? 'w-[55%]' : 'w-full'} ${imgLeft(slide) && slide.image_url ? 'ml-auto' : ''}`}>
                  {slide.badge_text && (
                    <div className="inline-flex items-center gap-2 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />{slide.badge_text}
                    </div>
                  )}
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                    {slide.title}
                    {slide.title_highlight && (
                      <><br /><AnimatedGradientText colorFrom="#FFD600" colorMid="#ffffff" colorTo="#9DC4FF" speed={3}>{slide.title_highlight}</AnimatedGradientText></>
                    )}
                  </h1>
                  {slide.subtitle && <p className="text-white/80 text-sm sm:text-base mb-5 sm:mb-6 max-w-[38ch] line-clamp-3 sm:line-clamp-none">{slide.subtitle}</p>}
                  <Link href={slide.cta_href}>
                    <ShimmerButton className="text-sm font-bold"
                      background={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnBase}, ${btnDark})`}
                      hoverBackground={`radial-gradient(ellipse 80% 50% at 50% 120%, ${btnLight}, ${btnBase})`}
                      shimmerColor="#fff">
                      {slide.cta_label}<ArrowRight className="w-4 h-4" />
                    </ShimmerButton>
                  </Link>
                </div>
              </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Setas */}
        {total > 1 && (
          <>
            <button onClick={prev} aria-label="Slide anterior"
              className={`absolute left-3 top-1/2 -translate-y-1/2 z-30 rounded-full p-2 transition-all backdrop-blur-sm ${isLightBg ? 'bg-black/10 hover:bg-black/20 text-gray-800' : 'bg-white/15 hover:bg-white/30 text-white'}`}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} aria-label="Próximo slide"
              className={`absolute right-3 top-1/2 -translate-y-1/2 z-30 rounded-full p-2 transition-all backdrop-blur-sm ${isLightBg ? 'bg-white/25 hover:bg-white/40 text-white' : 'bg-white/15 hover:bg-white/30 text-white'}`}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Ir para slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? `w-6 h-2 ${isLightBg ? 'bg-gray-700' : 'bg-white'}`
                    : `w-2 h-2 ${isLightBg ? 'bg-gray-400 hover:bg-gray-600' : 'bg-white/45 hover:bg-white/70'}`
                }`} />
            ))}
          </div>
        )}
      </div>

      {/* Cards abaixo */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {sideCards.map((card) => (
          <Link key={card.href} href={card.href}
            className={`relative flex flex-col justify-end p-3 sm:p-5 rounded-2xl overflow-hidden min-h-[90px] sm:min-h-[110px] cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${card.bg}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
            <div className="relative z-10">
              <p className="text-[0.55rem] sm:text-[0.65rem] font-bold uppercase tracking-widest text-white/75 mb-0.5">{card.label}</p>
              <h3 className="font-display text-xs sm:text-base font-bold text-white leading-snug">
                {(card as { titleNode?: React.ReactNode }).titleNode ?? card.title}
                <br /><span className="text-white/90 font-medium text-[0.65rem] sm:text-sm">{card.sub}</span>
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
