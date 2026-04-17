import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, MapPin, CheckCircle, Clock, Package, Truck, Home, XCircle, RefreshCw } from 'lucide-react'
import { getOrderById } from '@/actions/orders'
import { formatCurrency } from '@/lib/utils'
import { ORDER_STATUSES } from '@/lib/constants'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  payment_confirmed: CheckCircle,
  preparing: Package,
  shipped: Truck,
  out_for_delivery: Truck,
  delivered: Home,
  cancelled: XCircle,
  refunded: RefreshCw,
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  const status = ORDER_STATUSES[order.status]
  const address = order.shipping_address as Record<string, string>

  const timelineSteps = [
    { key: 'pending', label: 'Aguardando Pagamento' },
    { key: 'payment_confirmed', label: 'Pagamento Confirmado' },
    { key: 'preparing', label: 'Em Separação' },
    { key: 'shipped', label: 'Enviado' },
    { key: 'out_for_delivery', label: 'Saiu para Entrega' },
    { key: 'delivered', label: 'Entregue' },
  ]

  const currentStep = status.step
  const isCancelled = order.status === 'cancelled' || order.status === 'refunded'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/pedidos" className="text-muted-foreground hover:text-foreground text-sm">
          ← Meus Pedidos
        </Link>
      </div>

      <h1 className="font-display text-2xl font-bold text-foreground mb-2">
        Pedido #{order.id.slice(0, 8).toUpperCase()}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {new Date(order.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit', month: 'long', year: 'numeric',
        })}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-5">Status do Pedido</h2>

            {isCancelled ? (
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <XCircle className="w-5 h-5 text-destructive" />
                <span className="text-sm font-medium text-destructive">{status.label}</span>
              </div>
            ) : (
              <div className="space-y-0">
                {timelineSteps.map((step, index) => {
                  const Icon = statusIcons[step.key] ?? Clock
                  const stepNum = ORDER_STATUSES[step.key as keyof typeof ORDER_STATUSES]?.step ?? 0
                  const isCompleted = currentStep > stepNum
                  const isCurrent = currentStep === stepNum

                  return (
                    <div key={step.key} className="flex gap-4">
                      {/* Ícone e linha */}
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                          isCompleted ? 'bg-success border-success' :
                          isCurrent ? 'bg-primary border-primary' :
                          'bg-white border-border'
                        }`}>
                          <Icon className={`w-4 h-4 ${isCompleted || isCurrent ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>
                        {index < timelineSteps.length - 1 && (
                          <div className={`w-0.5 h-8 ${isCompleted ? 'bg-success' : 'bg-border'}`} />
                        )}
                      </div>

                      {/* Label */}
                      <div className="pb-6">
                        <p className={`text-sm font-medium ${isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                          {isCurrent && <span className="ml-2 text-xs text-primary font-normal">(atual)</span>}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {order.tracking_code && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Código de rastreamento</p>
                <p className="font-mono font-bold text-sm mt-0.5">{order.tracking_code}</p>
              </div>
            )}

            {order.payment_method === 'pix' && order.status === 'pending' && order.pix_key && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-semibold text-primary mb-1">Chave PIX para pagamento</p>
                <p className="font-mono text-sm bg-white border border-border px-3 py-2 rounded-md">
                  {order.pix_key}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Total: <strong>{formatCurrency(order.total)}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Itens */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Itens do Pedido</h2>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {item.product_image ? (
                      <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground">
                        {[item.size, item.color].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-accent flex-shrink-0">
                    {formatCurrency(item.total_price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar direita */}
        <div className="space-y-6">
          {/* Resumo */}
          <div className="bg-white rounded-xl border border-border p-5">
            <h2 className="font-semibold mb-4">Resumo</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className={order.shipping_cost === 0 ? 'text-success font-medium' : ''}>
                  {order.shipping_cost === 0 ? 'Grátis' : formatCurrency(order.shipping_cost)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-accent">{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Pagamento</span>
                <span className="capitalize">{order.payment_method === 'pix' ? 'PIX' : order.payment_method}</span>
              </div>
            </div>
          </div>

          {/* Endereço de entrega */}
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
