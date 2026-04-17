import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Package, MapPin, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartSheet } from '@/components/cart/CartSheet'
import { getUser } from '@/actions/auth'

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userData = await getUser()
  if (!userData) redirect('/login')

  const navItems = [
    { href: '/minha-conta', label: 'Minha Conta', icon: User },
    { href: '/pedidos', label: 'Meus Pedidos', icon: Package },
    { href: '/enderecos', label: 'Endereços', icon: MapPin },
  ]

  return (
    <>
      <Header />
      <CartSheet />
      <main className="min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-56 flex-shrink-0">
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                {/* Avatar / Nome */}
                <div className="p-4 border-b border-border bg-primary/5">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg mb-2">
                    {userData.profile?.full_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <p className="font-semibold text-sm text-foreground truncate">
                    {userData.profile?.full_name ?? 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{userData.user.email}</p>
                </div>
                {/* Nav */}
                <nav className="py-2">
                  {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      <span className="flex-1">{label}</span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
