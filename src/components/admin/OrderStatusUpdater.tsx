'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { updateOrderStatus } from '@/actions/admin/orders'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ORDER_STATUSES } from '@/lib/constants'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { OrderStatus } from '@/types/database'

interface OrderStatusUpdaterProps {
  orderId: string
  currentStatus: OrderStatus
  currentTrackingCode?: string | null
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Aguardando Pagamento' },
  { value: 'payment_confirmed', label: 'Pagamento Confirmado' },
  { value: 'preparing', label: 'Em Separação' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'out_for_delivery', label: 'Saiu para Entrega' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'refunded', label: 'Reembolsado' },
]

export function OrderStatusUpdater({ orderId, currentStatus, currentTrackingCode }: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [trackingCode, setTrackingCode] = useState(currentTrackingCode ?? '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    const result = await updateOrderStatus(orderId, status, trackingCode || undefined)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Status atualizado!')
      router.refresh()
    }
    setLoading(false)
  }

  const hasChanges = status !== currentStatus || trackingCode !== (currentTrackingCode ?? '')

  return (
    <div className="space-y-4">
      <div>
        <Label>Status do pedido</Label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="flex h-11 w-full rounded-lg border border-border bg-background px-4 text-sm mt-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className={`text-xs mt-1 font-medium ${ORDER_STATUSES[status].color}`}>
          Atual: {ORDER_STATUSES[status].label}
        </p>
      </div>

      <div>
        <Label>Código de rastreamento</Label>
        <Input
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          placeholder="Ex: BR123456789BR"
          className="mt-1.5"
        />
      </div>

      <Button onClick={handleSave} disabled={loading || !hasChanges} size="sm">
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {loading ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </div>
  )
}
