import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { getOrders } from '@/actions/orders'
import { formatCurrency } from '@/lib/utils'
import { ORDER_STATUSES } from '@/lib/constants'
import { EmptyState } from '@/components/shared/EmptyState'

export const metadata = { title: 'Meus Pedidos' }

export default async function PedidosPage() {
  const orders = await getOrders()

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-border">
          <EmptyState
            icon={Package}
            title="Nenhum pedido ainda"
            description="Quando você fizer uma compra, seus pedidos aparecerão aqui."
            action={
              <Link href="/produtos" className="btn-primary inline-block">
                Começar a comprar
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = ORDER_STATUSES[order.status]
            const firstItem = order.order_items[0]
            return (
              <Link
                key={order.id}
                href={`/pedidos/${order.id}`}
                className="bg-white rounded-xl border border-border p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow group"
              >
                {/* Ícone */}
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-accent text-sm">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.order_items.length} {order.order_items.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                    {order.tracking_code && (
                      <span className="text-xs text-muted-foreground">
                        Rastreio: {order.tracking_code}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
