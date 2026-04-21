import type { OrderStatus } from '@/types/database'

export const ORDER_STATUSES: Record<
  OrderStatus,
  { label: string; color: string; step: number }
> = {
  pending: { label: 'Aguardando Pagamento', color: 'text-yellow-600', step: 0 },
  payment_confirmed: { label: 'Pagamento Confirmado', color: 'text-blue-600', step: 1 },
  preparing: { label: 'Em Separação', color: 'text-purple-600', step: 2 },
  shipped: { label: 'Enviado', color: 'text-indigo-600', step: 3 },
  out_for_delivery: { label: 'Saiu para Entrega', color: 'text-orange-600', step: 4 },
  delivered: { label: 'Entregue', color: 'text-green-600', step: 5 },
  cancelled: { label: 'Cancelado', color: 'text-red-600', step: -1 },
  refunded: { label: 'Reembolsado', color: 'text-gray-600', step: -1 },
}

export const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', '36', '38', '40', '42', '44', '46', '48', 'Único']

export const GENDERS = [
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'unissex', label: 'Unissex' },
  { value: 'infantil', label: 'Infantil' },
]

export const PAYMENT_METHODS = [
  { value: 'pix', label: 'PIX', description: 'Aprovação imediata' },
  { value: 'credit_card', label: 'Cartão de Crédito', description: 'Em breve' },
  { value: 'boleto', label: 'Boleto Bancário', description: 'Em breve' },
]

// Frete grátis acima de R$ 79
export const FREE_SHIPPING_THRESHOLD = 79

// Valor do frete padrão
export const SHIPPING_COST = 19.9

export const ITEMS_PER_PAGE = 12

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'price_asc', label: 'Menor Preço' },
  { value: 'price_desc', label: 'Maior Preço' },
  { value: 'name_asc', label: 'A-Z' },
]

export const STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
]
