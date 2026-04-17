import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getProductForEdit } from '@/actions/admin/products'
import { getCategories } from '@/actions/products'
import { ProductForm } from '@/components/admin/ProductForm'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export const metadata = { title: 'Editar Produto — Admin' }

export default async function EditarProdutoPage({ params }: EditProductPageProps) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProductForEdit(id),
    getCategories(),
  ])

  if (!product) notFound()

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/admin/produtos" className="hover:text-foreground">Produtos</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground truncate max-w-48">{product.name}</span>
      </nav>
      <h1 className="font-display text-2xl font-bold mb-8">Editar Produto</h1>
      <ProductForm
        categories={categories as any}
        initialData={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          compare_price: product.compare_price,
          category_id: product.category_id,
          brand: product.brand,
          material: product.material,
          gender: product.gender,
          active: product.active,
          featured: product.featured,
          sku: product.sku,
          product_images: (product as any).product_images ?? [],
          product_variants: (product as any).product_variants ?? [],
        }}
      />
    </div>
  )
}
