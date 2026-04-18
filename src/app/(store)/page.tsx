import Link from 'next/link'
import { ArrowRight, Truck, ShieldCheck, RefreshCw, CreditCard, Zap, Shirt, Star, Users } from 'lucide-react'
import { HeroBanner } from '@/components/home/HeroBanner'
import { ProductCard } from '@/components/products/ProductCard'
import { getFeaturedProducts, getCategories } from '@/actions/products'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { BlurFade } from '@/components/magicui/blur-fade'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { Marquee } from '@/components/magicui/marquee'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { BorderBeam } from '@/components/magicui/border-beam'

// Countdown Timer (server-safe placeholder — timer runs client-side)
import { FlashSaleTimer } from '@/components/home/FlashSaleTimer'

export default async function HomePage() {
  let dbProducts: Awaited<ReturnType<typeof getFeaturedProducts>> = []
  let categories: Awaited<ReturnType<typeof getCategories>> = []
  try {
    ;[dbProducts, categories] = await Promise.all([
      getFeaturedProducts(8),
      getCategories(),
    ])
  } catch {
    // Supabase ainda não configurado — usando dados de exemplo
  }
  const featuredProducts = dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS

  const trustItems = [
    { icon: ShieldCheck, label: 'Qualidade Garantida', desc: 'Produtos selecionados com cuidado' },
    { icon: Truck, label: 'Frete Grátis', desc: 'Acima de R$ 79 em todo Brasil' },
    { icon: RefreshCw, label: 'Troca Grátis', desc: '7 dias para trocar tamanho' },
    { icon: CreditCard, label: '10x Sem Juros', desc: 'Nos principais cartões' },
  ]

  const promoBanners = [
    {
      bg: 'from-[#0064D2] to-[#3D8FFF]',
      pct: 50,
      label: '👗 Feminino',
      title: 'Vestidos & Blusas',
      sub: 'grandes descontos',
      href: '/categorias/vestidos',
    },
    {
      bg: 'from-[#FF6B00] to-[#FF9E3D]',
      pct: 40,
      label: '🔥 Hot Sale',
      title: 'Camisetas',
      sub: 'a partir de R$ 29',
      href: '/categorias/camisetas',
    },
    {
      bg: 'from-[#7B2D8B] to-[#A855C8]',
      pct: 35,
      label: '🧥 Inverno',
      title: 'Jaquetas & Moletons',
      sub: 'preço especial',
      href: '/categorias/jaquetas',
    },
  ]

  const categoryIcons: Record<string, string> = {
    camisetas: '👕',
    calcas: '👖',
    vestidos: '👗',
    moletons: '🫧',
    shorts: '🩳',
    jaquetas: '🧥',
    acessorios: '👜',
  }

  const marqueeItems = [
    { label: '🛍️ Todos', href: '/produtos' },
    ...categories.map((cat) => ({
      label: `${categoryIcons[cat.slug] ?? '🛍️'} ${cat.name}`,
      href: `/categorias/${cat.slug}`,
    })),
    { label: '🔥 Promoções', href: '/produtos?promocao=true' },
  ]

  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1260px] mx-auto px-4 sm:px-6 pt-5 pb-0">
        {/* HERO */}
        <HeroBanner />

        {/* TRUST STRIP */}
        <BlurFade delay={0.1} inView>
          <div className="bg-white rounded-xl border border-border grid grid-cols-2 md:grid-cols-4 overflow-hidden mb-8">
            {trustItems.map(({ icon: Icon, label, desc }, i) => (
              <div
                key={label}
                className={`flex items-center gap-3 p-5 ${i < 3 ? 'border-r border-border last:border-r-0' : ''} ${i >= 2 ? 'border-t md:border-t-0 border-border' : ''}`}
              >
                <Icon className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground leading-snug">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </BlurFade>

        {/* MARQUEE CATEGORIAS */}
        <BlurFade delay={0.15} inView>
          <div className="mb-8 overflow-hidden rounded-xl bg-white border border-border py-1">
            <Marquee pauseOnHover speed={30} repeat={2}>
              {marqueeItems.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 bg-primary-light text-primary text-xs font-semibold px-4 py-2 rounded-full border border-primary-hl hover:bg-primary hover:text-white transition-colors mx-1.5 whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </Marquee>
          </div>
        </BlurFade>

        {/* CATEGORIAS */}
        {categories.length > 0 && (
          <BlurFade delay={0.2} inView>
            <section className="mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3 after:flex-1 after:h-px after:bg-border after:content-['']">
                Categorias
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3">
                <Link
                  href="/produtos"
                  className="flex flex-col items-center p-4 bg-white rounded-xl border border-border hover:border-primary hover:bg-primary-light hover:shadow-card-hover transition-all duration-200 group"
                >
                  <span className="text-3xl mb-2">🛍️</span>
                  <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors text-center leading-tight">
                    Todos
                  </span>
                </Link>
                {categories.filter((c) => c.show_in_grid).slice(0, 7).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categorias/${cat.slug}`}
                    className="flex flex-col items-center p-4 bg-white rounded-xl border border-border hover:border-primary hover:bg-primary-light hover:shadow-card-hover transition-all duration-200 group"
                  >
                    <span className="text-3xl mb-2">{categoryIcons[cat.slug] ?? '🛍️'}</span>
                    <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors text-center leading-tight">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </BlurFade>
        )}

        {/* OFERTAS RELÂMPAGO */}
        <section id="produtos" className="mb-8">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Ofertas Relâmpago
            </h2>
            <FlashSaleTimer />
            <Link href="/produtos" className="ml-auto text-xs font-semibold text-primary hover:underline">
              Ver todas →
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featuredProducts.slice(0, 5).map((product, i) => (
                <BlurFade key={product.id} delay={i * 0.05} inView>
                  <ProductCard product={product} featured={i === 0} />
                </BlurFade>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-border">
              <p className="text-muted-foreground text-sm">Nenhum produto em destaque ainda.</p>
              <p className="text-xs text-muted-foreground mt-1">Adicione produtos no painel admin para começar a vender.</p>
            </div>
          )}
        </section>

        {/* PROMO BANNERS */}
        <BlurFade delay={0.1} inView>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {promoBanners.map((banner) => (
              <Link
                key={banner.href}
                href={banner.href}
                className={`relative bg-gradient-to-br ${banner.bg} rounded-xl p-6 min-h-[140px] flex flex-col justify-end cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden`}
              >
                <BorderBeam colorFrom="#ffffff" colorTo="rgba(255,255,255,0.2)" duration={8} />
                {/* Pct badge */}
                <div className="absolute top-4 right-4 bg-gold-DEFAULT text-foreground font-display font-extrabold w-12 h-12 rounded-full flex items-center justify-center flex-col leading-none" style={{ backgroundColor: '#FFD600' }}>
                  <span className="text-base font-extrabold">{banner.pct}%</span>
                  <span className="text-[0.5rem] font-bold">OFF</span>
                </div>
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-white/75 mb-1">{banner.label}</p>
                <h3 className="font-display text-lg font-bold text-white leading-snug">
                  {banner.title}
                  <br />
                  <span className="font-normal text-sm text-white/80">{banner.sub}</span>
                </h3>
                <span className="text-xs text-white/70 mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Ver coleção <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </BlurFade>

        {/* MAIS PRODUTOS */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3 after:flex-1 after:h-px after:bg-border after:content-['']">
            Mais Produtos
            <Link href="/produtos" className="text-xs font-semibold text-primary ml-auto whitespace-nowrap hover:underline after:hidden">
              Ver todos →
            </Link>
          </h2>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {featuredProducts.slice(4, 8).map((product, i) => (
                <BlurFade key={product.id} delay={i * 0.06} inView>
                  <ProductCard product={product} />
                </BlurFade>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-border">
              <p className="text-muted-foreground text-sm">Nenhum produto cadastrado.</p>
            </div>
          )}
        </section>

        {/* ABOUT / STATS */}
        <BlurFade delay={0.1} inView>
          <section className="bg-white rounded-xl border border-border p-8 sm:p-10 mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
            <div className="w-16 h-16 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
              <Shirt className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold mb-2">Nossa Loja de Moda</h2>
              <p className="text-sm text-muted-foreground max-w-[60ch] leading-relaxed">
                Todos os produtos são nossos — selecionados com cuidado e enviados diretamente de nosso estoque para você. Trabalhamos com as melhores peças para garantir qualidade, conforto e estilo no seu dia a dia.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-5">
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-primary flex items-baseline gap-0.5">
                    +<NumberTicker value={30000} delay={0.2} className="font-display text-2xl font-bold text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Users className="w-3 h-3" /> Clientes</p>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-primary flex items-baseline gap-0.5">
                    <NumberTicker value={4.9} delay={0.3} decimalPlaces={1} className="font-display text-2xl font-bold text-primary" />
                    ★
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Star className="w-3 h-3" /> Avaliação</p>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-primary">
                    <NumberTicker value={5000} delay={0.4} className="font-display text-2xl font-bold text-primary" />+
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Produtos</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  { icon: ShieldCheck, label: 'Loja Verificada' },
                  { icon: Truck, label: 'Estoque Próprio' },
                  { icon: Star, label: '4.9 Avaliação' },
                  { icon: RefreshCw, label: 'Troca Grátis' },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 bg-primary-light text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary-hl">
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </BlurFade>
      </div>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-primary-dark via-primary to-primary-dark text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <BlurFade inView delay={0.1}>
            <h2 className="font-display text-3xl font-bold mb-3">
              Crie sua conta e ganhe vantagens
            </h2>
            <p className="text-white/80 text-sm mb-8 max-w-[40ch] mx-auto">
              Acompanhe seus pedidos, salve endereços e tenha acesso a promoções exclusivas para membros.
            </p>
            <Link href="/cadastro">
              <ShimmerButton
                shimmerColor="#FFD600"
                background="radial-gradient(ellipse 80% 50% at 50% 120%, #FF5C1A, #E04A10)"
                className="mx-auto text-base font-bold px-8 py-3.5"
              >
                Criar conta grátis
                <ArrowRight className="w-4 h-4" />
              </ShimmerButton>
            </Link>
          </BlurFade>
        </div>
      </section>
    </div>
  )
}
