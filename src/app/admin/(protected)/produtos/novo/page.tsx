import { getCategories } from '@/actions/products'
import { ProductForm } from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata = { title: 'Novo Produto — Admin' }

export default async function NovoProdutoPage() {
  const categories = await getCategories()

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/admin/produtos" className="hover:text-foreground">Produtos</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Novo Produto</span>
      </nav>
      <h1 className="font-display text-2xl font-bold mb-8">Novo Produto</h1>
      <ProductForm categories={categories as any} />
    </div>
  )
}
