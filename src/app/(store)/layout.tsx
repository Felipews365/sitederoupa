import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartSheet } from '@/components/cart/CartSheet'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <CartSheet />
      <main className="min-h-screen bg-surface pb-14 sm:pb-0">
        {children}
      </main>
      <Footer />
    </>
  )
}
