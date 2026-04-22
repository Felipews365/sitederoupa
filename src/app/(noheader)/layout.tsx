import { CartSheet } from '@/components/cart/CartSheet'

export default function NoHeaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CartSheet />
      <main className="min-h-screen bg-surface">
        {children}
      </main>
    </>
  )
}
