import { Suspense } from 'react'
import { getProducts, getCategories, getAvailableColors } from '@/actions/products'
import { ProductCard } from '@/components/products/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { FilterSidebar } from '@/components/products/FilterSidebar'
import { MobileFilterSheet } from '@/components/products/MobileFilterSheet'
import { SortSelect } from '@/components/products/SortSelect'
import Link from 'next/link'

interface ProductsPageProps {
  searchParams: Promise<{
    categoria?: string
    ordenar?: string
    pagina?: string
    genero?: string
    preco_min?: string
    preco_max?: string
    tamanhos?: string
    cores?: string
    q?: string
    promocao?: string
  }>
}

export const metadata = {
  title: 'Produtos',
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const page = Number(params.pagina ?? 1)
  const limit = 12

  const sizes = params.tamanhos ? params.tamanhos.split(',').filter(Boolean) : undefined
  const colors = params.cores ? params.cores.split(',').filter(Boolean) : undefined

  const [{ products, total }, categories, availableColors] = await Promise.all([
    getProducts({
      categorySlug: params.categoria,
      search: params.q,
      sortBy: params.ordenar,
      page,
      limit,
      gender: params.genero,
      minPrice: params.preco_min ? Number(params.preco_min) : undefined,
      maxPrice: params.preco_max ? Number(params.preco_max) : undefined,
      sizes,
      colors,
      onSale: params.promocao === 'true',
    }),
    getCategories(),
    getAvailableColors(),
  ])

  const totalPages = Math.ceil(total / limit)

  // Contar filtros ativos para badge no mobile
  const activeFilterCount = [
    params.categoria,
    params.genero,
    params.preco_min || params.preco_max,
    sizes && sizes.length > 0,
    colors && colors.length > 0,
  ].filter(Boolean).length

  const filterParams = {
    categoria: params.categoria,
    genero: params.genero,
    preco_min: params.preco_min,
    preco_max: params.preco_max,
    tamanhos: params.tamanhos,
    cores: params.cores,
    q: params.q,
    ordenar: params.ordenar,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar de filtros — desktop */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <FilterSidebar
            categories={categories}
            availableColors={availableColors}
            params={filterParams}
          />
        </aside>

        {/* Grid de produtos */}
        <div className="flex-1">
          {/* Barra de resultados */}
          <div className="flex items-center justify-between mb-6 gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold text-foreground truncate">
                {params.q
                  ? `Resultados para "${params.q}"`
                  : params.promocao === 'true'
                  ? '🔥 Promoções'
                  : params.categoria
                  ? categories.find((c) => c.slug === params.categoria)?.name ?? 'Produtos'
                  : 'Todos os Produtos'}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {total} {total === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Botão de filtros — mobile */}
              <div className="md:hidden">
                <MobileFilterSheet
                  categories={categories}
                  availableColors={availableColors}
                  params={filterParams}
                  activeFilterCount={activeFilterCount}
                />
              </div>

              {/* Ordenação */}
              <SortSelect value={params.ordenar} />
            </div>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const url = new URLSearchParams({ ...params, pagina: String(p) })
                      return (
                        <Link
                          key={p}
                          href={`/produtos?${url.toString()}`}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'bg-white border border-border hover:bg-muted'}`}
                        >
                          {p}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-border">
                <p className="text-lg font-medium text-foreground">Nenhum produto encontrado</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Tente outros filtros ou{' '}
                  <Link href="/produtos" className="text-accent hover:underline">
                    veja todos os produtos
                  </Link>
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden">
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
