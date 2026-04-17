import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, Copy, Package } from 'lucide-react'
import { getOrderById } from '@/actions/orders'
import { formatCurrency } from '@/lib/utils'

interface ConfirmacaoPageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function ConfirmacaoPage({ searchParams }: ConfirmacaoPageProps) {
  const { orderId } = await searchParams

  if (!orderId) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Pedido não encontrado.</p>
        <Link href="/" className="text-accent mt-4 inline-block hover:underline">Voltar ao início</Link>
      </div>
    )
  }

  const order = await getOrderById(orderId)

  return (
    <div className="max-w-lg mx-auto py-8">
      {/* Sucesso */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Pedido confirmado!
        </h1>
        <p className="text-muted-foreground">
          Seu pedido #{orderId.slice(0, 8).toUpperCase()} foi registrado com sucesso.
        </p>
      </div>

      {order && (
        <>
          {/* PIX */}
          {order.payment_method === 'pix' && order.status === 'pending' && order.pix_key && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
              <h2 className="font-semibold text-primary mb-3">Pague via PIX</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valor a pagar:</p>
                  <p className="text-2xl font-bold text-accent">{formatCurrency(order.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Chave PIX:</p>
                  <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2">
                    <code className="text-sm flex-1 font-mono">{order.pix_key}</code>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(order.pix_key!)
                      }}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Após realizar o pagamento, confirmaremos em até 1 hora e seu pedido será preparado.
                </p>
              </div>
            </div>
          )}

          {/* Resumo */}
          <div className="bg-white rounded-xl border border-border p-5 mb-6">
            <h2 className="font-semibold mb-3">Resumo do Pedido</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pedido</span>
                <span className="font-mono">#{orderId.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Itens</span>
                <span>{order.order_items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-accent">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Ações */}
      <div className="flex flex-col gap-3">
        <Link
          href={`/pedidos/${orderId}`}
          className="flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Package className="w-4 h-4" />
          Acompanhar Pedido
        </Link>
        <Link
          href="/produtos"
          className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          Continuar comprando
        </Link>
      </div>
    </div>
  )
}
