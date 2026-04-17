import Link from 'next/link'
import { ShoppingBag, Lock } from 'lucide-react'

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-primary py-4 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-accent" />
          <span className="font-display text-lg font-bold text-white">LojaRoupas</span>
        </Link>
        <div className="flex items-center gap-1 text-white/70 text-sm">
          <Lock className="w-3.5 h-3.5" />
          <span>Compra segura</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
