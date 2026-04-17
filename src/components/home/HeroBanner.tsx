'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { ShimmerButton } from '@/components/magicui/shimmer-button'

export function HeroBanner() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 mb-6" aria-label="Destaques da loja">
      {/* Hero Principal */}
      <div className="relative bg-gradient-to-br from-[#001C45] via-primary to-[#0086FF] rounded-2xl overflow-hidden flex items-end p-8 sm:p-10 min-h-[300px] lg:min-h-[340px] cursor-pointer group">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(255,255,255,0.07)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(245,166,35,0.1)_0%,transparent_40%)]" />
          {/* Animated circles */}
          <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-white/5 animate-pulse" />
          <div className="absolute top-16 right-16 w-20 h-20 rounded-full bg-yellow-400/10 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-md">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Nova Coleção 2026
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-3">
            Vista-se com{' '}
            <br />
            <AnimatedGradientText
              colorFrom="#FFD600"
              colorMid="#ffffff"
              colorTo="#9DC4FF"
              speed={3}
            >
              Muito Estilo
            </AnimatedGradientText>
          </h1>

          <p className="text-white/80 text-sm sm:text-base mb-6 max-w-[38ch]">
            Roupas de qualidade premium para o dia a dia. Coleção nova toda semana com os melhores preços.
          </p>

          <Link href="/produtos">
            <ShimmerButton
              className="text-sm font-bold"
              background="radial-gradient(ellipse 80% 50% at 50% 120%, #FF6B00, #E05A00)"
              shimmerColor="#fff"
            >
              Ver coleção completa
              <ArrowRight className="w-4 h-4" />
            </ShimmerButton>
          </Link>
        </div>
      </div>

      {/* Side Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        {/* Side 1 - Camisetas */}
        <Link
          href="/categorias/camisetas"
          className="relative flex flex-col justify-end p-5 rounded-2xl overflow-hidden min-h-[130px] lg:min-h-0 lg:flex-1 cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-[#FF5C1A] to-[#FF8C42]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
          <div className="relative z-10">
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-white/75 mb-0.5">🔥 Imperdível</p>
            <h3 className="font-display text-base font-bold text-white leading-snug">
              Camisetas &amp; Polos<br />
              <span className="text-white/90 font-medium text-sm">A partir de R$ 39</span>
            </h3>
            <span className="text-xs text-white/70 mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
              Explorar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Side 2 - Vestidos */}
        <Link
          href="/categorias/vestidos"
          className="relative flex flex-col justify-end p-5 rounded-2xl overflow-hidden min-h-[130px] lg:min-h-0 lg:flex-1 cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-[#7B2D8B] to-[#A855C8]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
          <div className="relative z-10">
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-white/75 mb-0.5">✨ Destaque</p>
            <h3 className="font-display text-base font-bold text-white leading-snug">
              Vestidos<br />
              <span className="text-white/90 font-medium text-sm">Coleção Verão</span>
            </h3>
            <span className="text-xs text-white/70 mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
              Ver modelos <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Side 3 - Promoções (hidden on mobile, show as 3rd on lg) */}
        <Link
          href="/produtos?ordenar=price_asc"
          className="hidden lg:flex relative flex-col justify-end p-5 rounded-2xl overflow-hidden lg:flex-1 cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-[#003F8A] to-[#001C45]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
          <div className="relative z-10">
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-white/75 mb-0.5">
              <Zap className="inline w-3 h-3 mr-0.5" style={{ color: '#F5A623' }} />
              Oferta
            </p>
            <h3 className="font-display text-base font-bold text-white leading-snug">
              Até <span style={{ color: '#F5A623' }}>50% OFF</span><br />
              <span className="text-white/90 font-medium text-sm">Peças selecionadas</span>
            </h3>
            <span className="text-xs text-white/70 mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
              Aproveitar <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
