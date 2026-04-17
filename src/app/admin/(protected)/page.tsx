import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { getAdminStats } from '@/actions/admin/orders'
import { formatCurrency } from '@/lib/utils'

export const metadata = { title: 'Dashboard — Admin' }

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  const cards = [
    {
      label: 'Receita Total',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-green-50 text-green-700',
      iconBg: 'bg-green-100',
    },
    {
      label: 'Pedidos',
      value: stats.totalOrders,
      icon: Package,
      color: 'bg-blue-50 text-blue-700',
      iconBg: 'bg-blue-100',
      sub: `${stats.recentOrders} nos últimos 7 dias`,
    },
    {
      label: 'Pedidos Pendentes',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-700',
      iconBg: 'bg-yellow-100',
      link: '/admin/pedidos?status=pending',
    },
    {
      label: 'Produtos Ativos',
      value: stats.totalProducts,
      icon: ShoppingBag,
      color: 'bg-purple-50 text-purple-700',
      iconBg: 'bg-purple-100',
      link: '/admin/produtos',
    },
    {
      label: 'Clientes',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700',
      iconBg: 'bg-indigo-100',
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Visão geral da sua loja</p>
        </div>
        <Link href="/admin/produtos/novo" className="btn-primary text-sm">
          + Novo Produto
        </Link>
      </div>

      {/* Cards de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-xl border border-border p-5 ${card.link ? 'cursor-pointer hover:shadow-card-hover transition-shadow' : ''}`}
          >
            {card.link ? (
              <Link href={card.link} className="block">
                <StatCardContent card={card} />
              </Link>
            ) : (
              <StatCardContent card={card} />
            )}
          </div>
        ))}
      </div>

      {/* Atalhos rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          {
            href: '/admin/produtos/novo',
            icon: ShoppingBag,
            label: 'Adicionar Produto',
            desc: 'Cadastre novas peças na loja',
          },
          {
            href: '/admin/pedidos',
            icon: Package,
            label: 'Gerenciar Pedidos',
            desc: 'Atualize status e rastreamento',
          },
          {
            href: '/admin/categorias',
            icon: TrendingUp,
            label: 'Categorias',
            desc: 'Organize sua coleção',
          },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-card-hover transition-shadow flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function StatCardContent({ card }: { card: { label: string; value: string | number; icon: React.ComponentType<{className?: string}>; iconBg: string; sub?: string } }) {
  const Icon = card.icon
  return (
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{card.label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{card.value}</p>
        {card.sub && <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>}
      </div>
    </div>
  )
}
