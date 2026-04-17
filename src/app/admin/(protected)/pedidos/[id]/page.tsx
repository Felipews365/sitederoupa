import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ShoppingBag, MapPin } from 'lucide-react'
import { getAdminOrderById } from '@/actions/admin/orders'
import { formatCurrency } from '@/lib/utils'
import { ORDER_STATUSES } from '@/lib/constants'
import { OrderStatusUpdater } from '@/components/admin/OrderStatusUpdater'

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params
  const order = await getAdminOrderById(id)
  if (!order) notFound()

  const address = order.shipping_address as Record<string, string>
  const profile = (order as any).profiles

  return (
    <div>
      <Link href="/admin/pedidos" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="w-4 h-4" /> Pedidos
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold">Pedido #{id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span className={`text-sm font-semibold ${(ORDER_STATUSES as any)[order.status]?.color ?? ''}`}>
          {(ORDER_STATUSES as any)[order.status]?.label ?? order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Atualizar status */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h2 className="font-semibold mb-4">Atualizar Status</h2>
            <OrderStatusUpdater
              orderId={id}
              currentStatus={order.status}
              currentTrackingCode={order.tracking_code}
            />
          </div>

          {/* Itens */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h2 className="font-semibold mb-4">Itens ({order.order_items.length})</h2>
            <div className="space-y-4">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {item.product_image ? (
                      <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[item.size, item.color].filter(Boolean).join(' · ')} · Qtd: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-accent flex-shrink-0">
                    {formatCurrency(item.total_price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Cliente */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h2 className="font-semibold mb-3 text-sm">Cliente</h2>
            <p className="text-sm font-medium">{profile?.full_name ?? '—'}</p>
            {profile?.cpf && <p className="text-xs text-muted-foreground">CPF: {profile.cpf}</p>}
            {profile?.phone && <p className="text-xs text-muted-foreground">Tel: {profile.phone}</p>}
          </div>

          {/* Resumo financeiro */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h2 className="font-semibold mb-3 text-sm">Resumo</h2>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span>{order.shipping_cost === 0 ? 'Grátis' : formatCurrency(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-accent">{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Pagamento</span>
                <span>{order.payment_method === 'pix' ? 'PIX' : order.payment_method}</span>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-sm">Endereço de Entrega</h2>
            </div>
            <address className="not-italic text-sm text-muted-foreground space-y-0.5">
              <p className="font-medium text-foreground">{address.recipient}</p>
              <p>{address.street}, {address.number}{address.complement ? ` - ${address.complement}` : ''}</p>
              <p>{address.neighborhood}</p>
              <p>{address.city} - {address.state}</p>
              <p>CEP: {address.zip_code}</p>
            </address>
          </div>
        </div>
      </div>
    </div>
  )
}
