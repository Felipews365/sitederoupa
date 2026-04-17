'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag, Search, User, Menu, X, LogOut,
  Package, MapPin, Heart, Sparkles,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navLinks = [
  { href: '/produtos', label: '✨ Novidades', active: true },
  { href: '/categorias/camisetas', label: '👕 Camisetas' },
  { href: '/categorias/vestidos', label: '👗 Vestidos' },
  { href: '/categorias/calcas', label: '👖 Calças' },
  { href: '/categorias/jaquetas', label: '🧥 Jaquetas' },
  { href: '/categorias/shorts', label: '🩳 Shorts' },
  { href: '/categorias/moletons', label: '🫧 Moletons' },
  { href: '/produtos?ordenar=price_asc', label: '🔥 Promoções' },
]

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const router = useRouter()
  const { totalItems, toggleCart } = useCartStore()
  const itemCount = totalItems()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      {/* Promo Bar */}
      <div className="bg-primary-dark text-white text-center py-2 px-4 text-xs font-medium tracking-wide">
        <span className="hidden sm:inline">
          🚀 Nova coleção chegou! &nbsp;|&nbsp;
          🚚 Frete grátis acima de <span className="text-gold font-bold">R$ 79</span> &nbsp;|&nbsp;
          💳 Até <span className="text-gold font-bold">10x</span> sem juros &nbsp;|&nbsp;
          🔄 Troca grátis em <span className="text-gold font-bold">30 dias</span>
        </span>
        <span className="sm:hidden">
          🚚 Frete grátis acima de <span className="text-gold font-bold">R$ 79</span>
        </span>
      </div>

      {/* Header Principal */}
      <div className="bg-primary">
        <div className="max-w-[1260px] mx-auto px-4 sm:px-6 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-DEFAULT" style={{ color: '#FFD600' }} />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-xl font-bold text-white leading-none">
                Mercado<span style={{ color: '#FFD600' }}>Verde</span>
              </span>
              <span className="block text-[0.6rem] font-medium text-white/60 uppercase tracking-widest mt-0.5">
                Moda &amp; Estilo
              </span>
            </div>
            <span className="sm:hidden font-display text-lg font-bold text-white leading-none">
              MV
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full overflow-hidden border-2 border-transparent focus-within:border-gold-DEFAULT transition-colors" style={{ '--tw-border-opacity': 1 } as React.CSSProperties}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar roupas, modelos, tamanhos..."
              className="flex-1 px-4 sm:px-5 py-2.5 border-none outline-none bg-transparent text-sm text-foreground placeholder-muted-foreground min-w-0"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-colors whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </form>

          {/* Ações */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Usuário */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-white/12 transition-colors min-w-[44px]"
              >
                <User className="w-5 h-5" />
                <span className="text-[0.65rem] whitespace-nowrap">{user ? 'Conta' : 'Entrar'}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-border z-50 py-2 text-foreground">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-xs text-muted-foreground">Logado como</p>
                        <p className="text-sm font-medium truncate">{user.email}</p>
                      </div>
                      <Link href="/minha-conta" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <User className="w-4 h-4" /> Minha Conta
                      </Link>
                      <Link href="/pedidos" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <Package className="w-4 h-4" /> Meus Pedidos
                      </Link>
                      <Link href="/enderecos" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <MapPin className="w-4 h-4" /> Endereços
                      </Link>
                      <hr className="my-1 border-border" />
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors w-full">
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-4 py-2 text-sm font-medium hover:bg-muted transition-colors" onClick={() => setUserMenuOpen(false)}>
                        Entrar
                      </Link>
                      <Link href="/cadastro" className="block px-4 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setUserMenuOpen(false)}>
                        Criar conta
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Favoritos */}
            <button className="hidden sm:flex flex-col items-center gap-0.5 text-white/90 hover:text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-white/12 transition-colors min-w-[44px]">
              <Heart className="w-5 h-5" />
              <span className="text-[0.65rem]">Favoritos</span>
            </button>

            {/* Sacola */}
            <button
              onClick={toggleCart}
              className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-white/12 transition-colors min-w-[44px] relative"
              aria-label="Carrinho de compras"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[0.6rem] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-primary">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
              <span className="text-[0.65rem]">Sacola</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Nav Categorias */}
      <nav className="bg-primary-dark hidden md:block">
        <div className="max-w-[1260px] mx-auto px-6 flex items-center overflow-x-auto scrollbar-hide">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 text-xs font-medium px-4 py-3 whitespace-nowrap border-b-2 transition-colors ${
                i === 0
                  ? 'text-gold-DEFAULT border-gold-DEFAULT'
                  : 'text-white/80 hover:text-white border-transparent hover:border-gold-DEFAULT'
              }`}
              style={i === 0 ? { color: '#FFD600', borderColor: '#FFD600' } : {}}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-dark border-t border-white/10 px-4 py-4">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex bg-white rounded-full overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar roupas..."
                className="flex-1 px-4 py-2.5 text-sm text-foreground outline-none"
              />
              <button type="submit" className="px-4 bg-accent text-white rounded-full text-sm font-semibold">
                Buscar
              </button>
            </div>
          </form>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white py-2 text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-white/10 my-2" />
            {user ? (
              <>
                <Link href="/minha-conta" className="text-white/80 hover:text-white py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>👤 Minha Conta</Link>
                <Link href="/pedidos" className="text-white/80 hover:text-white py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>📦 Meus Pedidos</Link>
                <button onClick={handleLogout} className="text-left text-white/60 py-2 text-sm">🚪 Sair</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white/80 hover:text-white py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Entrar</Link>
                <Link href="/cadastro" className="text-white/80 hover:text-white py-2 text-sm" onClick={() => setMobileMenuOpen(false)}>Criar conta</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
