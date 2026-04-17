import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Package,
  ImagePlay,
  LogOut,
} from 'lucide-react'
import { getUser } from '@/actions/auth'
import { logout } from '@/actions/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect('/admin/login')
  }

  let userData = null
  try {
    userData = await getUser()
  } catch {
    redirect('/admin/login')
  }
  if (!userData || userData.profile?.role !== 'admin') {
    redirect('/admin/login')
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/produtos', label: 'Produtos', icon: ShoppingBag },
    { href: '/admin/categorias', label: 'Categorias', icon: Tag },
    { href: '/admin/banners', label: 'Banners Carrossel', icon: ImagePlay },
    { href: '/admin/pedidos', label: 'Pedidos', icon: Package },
  ]

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="w-60 bg-primary text-white flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            <span className="font-display font-bold text-sm">LojaRoupas Admin</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors group"
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="mb-3">
            <p className="text-xs text-white/50">Logado como</p>
            <p className="text-sm font-medium text-white truncate">{userData.user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors text-center"
            >
              Ver Loja
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1 text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Sair
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">{children}</div>
      </main>
    </div>
  )
}
