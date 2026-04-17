import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header simples */}
      <header className="bg-primary py-4 px-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <ShoppingBag className="w-6 h-6 text-accent" />
          <span className="font-display text-lg font-bold text-white">LojaRoupas</span>
        </Link>
      </header>

      {/* Conteúdo centralizado */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      <footer className="text-center text-sm text-muted-foreground py-6">
        <p>© 2026 LojaRoupas</p>
      </footer>
    </div>
  )
}
