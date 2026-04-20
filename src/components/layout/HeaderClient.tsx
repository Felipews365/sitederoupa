'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag, Search, User, Menu, X, LogOut,
  Package, MapPin, Heart, Sparkles, Home,
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { CategoryDropdown } from './CategoryDropdown'

const categoryIcons: Record<string, string> = {
  camisetas: '👕',
  calcas: '👖',
  vestidos: '👗',
  moletons: '🫧',
  shorts: '🩳',
  jaquetas: '🧥',
  acessorios: '👜',
}

const MAX_NAV_CATEGORIES = 6

type Category = {
  id: string
  name: string
  slug: string
}

export function HeaderClient({ categories }: { categories: Category[] }) {
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

  const visibleCategories = categories.slice(0, MAX_NAV_CATEGORIES)
  const extraCategories = categories.slice(MAX_NAV_CATEGORIES)

  return (
    <>
    <header className="sticky top-0 z-50 shadow-lg">
      {/* Promo Bar */}
      <div className="bg-primary-dark text-white text-center py-2 px-4 text-xs font-medium tracking-wide">
        <span className="hidden sm:inline">
          🚀 Nova coleção chegou! &nbsp;|&nbsp;
          🚚 Frete grátis acima de <span className="text-gold font-bold">R$ 79</span> &nbsp;|&nbsp;
          💳 Até <span className="text-gold font-bold">10x</span> sem juros &nbsp;|&nbsp;
          🔄 Troca grátis em <span className="text-gold font-bold">7 dias</span>
        </span>
        <span className="sm:hidden">
          🚚 Frete grátis acima de <span className="text-gold font-bold">R$ 79</span>
        </span>
      </div>

      {/* Header Principal — Mobile (2 linhas) */}
      <div className="sm:hidden bg-primary">
        {/* Linha 1: Logo */}
        <div className="px-4 pt-2.5 pb-2 flex items-center relative">
          <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" style={{ color: '#FFD600' }} />
          </div>
          <Link href="/" className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <span className="font-display text-base font-bold text-white pointer-events-auto">
              Black<span style={{ color: '#FFD600' }}>Import</span>
            </span>
          </Link>
          {/* dropdown de conta oculto mas mantido para compatibilidade com estado */}
          {userMenuOpen && (
                <div className="absolute right-4 top-16 w-52 bg-white rounded-xl shadow-lg border border-border z-50 py-2 text-foreground">
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
        {/* Linha 2: Barra de busca full-width */}
        <div className="px-4 pb-3">
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full overflow-hidden border-2 border-transparent focus-within:border-yellow-400 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground ml-4 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar roupas, modelos, tamanhos..."
              className="flex-1 px-3 py-3 border-none outline-none bg-transparent text-sm text-foreground placeholder-muted-foreground min-w-0"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-accent text-white font-semibold text-sm transition-colors whitespace-nowrap rounded-r-full"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Header Principal — Desktop (3 colunas) */}
      <div className="hidden sm:block bg-primary">
        <div className="max-w-[1260px] mx-auto px-6 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-DEFAULT" style={{ color: '#FFD600' }} />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-white leading-none">
                Black<span style={{ color: '#FFD600' }}>Import</span>
              </span>
              <span className="block text-[0.6rem] font-medium text-white/60 uppercase tracking-widest mt-0.5">
                Moda &amp; Estilo
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full overflow-hidden border-2 border-transparent focus-within:border-gold-DEFAULT transition-colors" style={{ '--tw-border-opacity': 1 } as React.CSSProperties}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar roupas, modelos, tamanhos..."
              className="flex-1 px-5 py-2.5 border-none outline-none bg-transparent text-sm text-foreground placeholder-muted-foreground min-w-0"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-colors whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </button>
          </form>

          {/* Ações */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Usuário */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/12 transition-colors min-w-[44px]"
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
            <button className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/12 transition-colors min-w-[44px]">
              <Heart className="w-5 h-5" />
              <span className="text-[0.65rem]">Favoritos</span>
            </button>

            {/* Sacola */}
            <button
              onClick={toggleCart}
              className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/12 transition-colors min-w-[44px] relative"
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
          </div>
        </div>
      </div>

      {/* Nav Categorias */}
      <nav className="bg-primary-dark hidden md:block">
        <div className="max-w-[1260px] mx-auto px-6 flex items-center overflow-x-auto scrollbar-hide">
          {/* Novidades — sempre primeiro */}
          <Link
            href="/produtos"
            className="flex items-center gap-1.5 text-xs font-medium px-4 py-3 whitespace-nowrap border-b-2 transition-colors"
            style={{ color: '#FFD600', borderColor: '#FFD600' }}
          >
            ✨ Novidades
          </Link>

          {/* Categorias dinâmicas */}
          {visibleCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className="flex items-center gap-1.5 text-xs font-medium px-4 py-3 whitespace-nowrap border-b-2 border-transparent text-white/80 hover:text-white hover:border-gold-DEFAULT transition-colors"
            >
              {categoryIcons[cat.slug] ?? '🛍️'} {cat.name}
            </Link>
          ))}

          {/* Dropdown "Ver todas" se houver categorias extras */}
          {extraCategories.length > 0 && (
            <CategoryDropdown categories={extraCategories} icons={categoryIcons} />
          )}

          {/* Promoções — sempre último */}
          <Link
            href="/produtos?promocao=true"
            className="flex items-center gap-1.5 text-xs font-medium px-4 py-3 whitespace-nowrap border-b-2 border-transparent text-white/80 hover:text-white hover:border-gold-DEFAULT transition-colors"
          >
            🔥 Promoções
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-primary-dark border-t border-white/10 px-4 py-4">
          <div className="flex flex-col gap-1">
            <Link
              href="/produtos"
              className="text-white/80 hover:text-white py-2 text-sm font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✨ Novidades
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categorias/${cat.slug}`}
                className="text-white/80 hover:text-white py-2 text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {categoryIcons[cat.slug] ?? '🛍️'} {cat.name}
              </Link>
            ))}
            <Link
              href="/produtos?promocao=true"
              className="text-white/80 hover:text-white py-2 text-sm font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔥 Promoções
            </Link>
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

    {/* Mobile Bottom Nav */}
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 flex items-center justify-around h-14">
      <Link
        href="/"
        className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-primary transition-colors px-3 py-1"
      >
        <Home className="w-5 h-5" />
        <span className="text-[0.65rem] font-medium">Início</span>
      </Link>
      <Link
        href={user ? '/minha-conta' : '/login'}
        className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-primary transition-colors px-3 py-1"
      >
        <User className="w-5 h-5" />
        <span className="text-[0.65rem] font-medium">Conta</span>
      </Link>
      <button
        onClick={toggleCart}
        className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-primary transition-colors px-3 py-1 relative"
        aria-label="Carrinho"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[0.6rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </div>
        <span className="text-[0.65rem] font-medium">Carrinho</span>
      </button>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-primary transition-colors px-3 py-1"
        aria-label="Menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        <span className="text-[0.65rem] font-medium">Menu</span>
      </button>
    </nav>
    </>
  )
}
