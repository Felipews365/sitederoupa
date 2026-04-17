import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { getAllOrders } from '@/actions/admin/orders'
import { formatCurrency } from '@/lib/utils'
import { ORDER_STATUSES } from '@/lib/constants'

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string }>
}

export const metadata = { title: 'Pedidos — Admin' }

export default async function AdminPedidosPage({ searchParams }: AdminOrdersPageProps) {
  const { status } = await searchParams
  const allOrders = await getAllOrders()

  const orders = status
    ? allOrders.filter((o: any) => o.status === status)
    : allOrders

  const statusCounts = Object.keys(ORDER_STATUSES).reduce((acc, s) => {
    acc[s] = allOrders.filter((o: any) => o.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Pedidos</h1>
        <span className="text-sm text-muted-foreground">{allOrders.length} pedidos</span>
      </div>

      {/* Filtros de status */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/admin/pedidos"
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!status ? 'bg-primary text-white' : 'bg-white border border-border hover:bg-muted'}`}
        >
          Todos ({allOrders.length})
        </Link>
        {[
          { key: 'pending', label: 'Aguardando' },
          { key: 'payment_confirmed', label: 'Pago' },
          { key: 'preparing', label: 'Separando' },
          { key: 'shipped', label: 'Enviado' },
          { key: 'delivered', label: 'Entregue' },
          { key: 'cancelled', label: 'Cancelado' },
        ].map(({ key, label }) => (
          <Link
            key={key}
            href={`/admin/pedidos?status=${key}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${status === key ? 'bg-primary text-white' : 'bg-white border border-border hover:bg-muted'}`}
          >
            {label} ({statusCounts[key] ?? 0})
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-border text-center py-12">
          <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Pedido</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Cliente</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Data</th>
                <th className="text-right px-4 py-3 font-medium">Total</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order: any) => {
                const statusInfo = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]
                return (
                  <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-mono font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{order.order_items?.length ?? 0} itens</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {order.profiles?.full_name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-accent">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted inline-block"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
