import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-4">
      <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Página não encontrada</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Link href="/" className="btn-primary">
        Voltar para a loja
      </Link>
    </div>
  )
}
