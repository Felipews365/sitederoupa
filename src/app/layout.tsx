import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: {
    default: 'Loja Roupas',
    template: '%s | Loja Roupas',
  },
  description: 'As melhores roupas com os melhores preços. Moda feminina, masculina e infantil.',
  keywords: ['roupas', 'moda', 'camisetas', 'vestidos', 'calças', 'loja online'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Loja Roupas',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster
          position="top-left"
          richColors
          toastOptions={{
            style: { fontFamily: 'Inter, sans-serif' },
          }}
        />
      </body>
    </html>
  )
}
