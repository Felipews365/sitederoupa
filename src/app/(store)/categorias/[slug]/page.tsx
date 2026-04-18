import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategories, getProducts } from '@/actions/products'
import { ProductCard } from '@/components/products/ProductCard'
import type { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === slug)
  return { title: category?.name ?? 'Categoria' }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const [categories, { products }] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: slug, limit: 48 }),
  ])

  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  return (
    <div className="min-h-screen bg-surface">
      {/* Cabeçalho da categoria */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-primary transition-colors">Início</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>
          <h1 className="text-3xl font-display font-bold text-foreground">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-muted-foreground">{category.description}</p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? 'produto' : 'produtos'}
          </p>
        </div>
      </div>

      {/* Grid de produtos */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-lg text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
            <Link
              href="/produtos"
              className="mt-4 inline-block text-primary hover:underline font-medium"
            >
              Ver todos os produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
