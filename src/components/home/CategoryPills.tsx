'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const categoryIcons: Record<string, string> = {
  camisetas: '👕',
  calcas: '👖',
  vestidos: '👗',
  moletons: '🫧',
  shorts: '🩳',
  jaquetas: '🧥',
  acessorios: '👜',
}

type Category = {
  id: string
  name: string
  slug: string
}

export function CategoryPills({ categories }: { categories: Category[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isAllActive = pathname === '/produtos' && !searchParams.get('promocao')

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 snap-x snap-mandatory">
      {/* Pill "Todos" */}
      <Link
        href="/produtos"
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-200 flex-shrink-0 snap-start ${
          isAllActive
            ? 'bg-primary text-white border-primary shadow-sm'
            : 'bg-white text-foreground border-border hover:border-primary hover:text-primary'
        }`}
      >
        🛍️ Todos
      </Link>

      {categories.map((cat) => {
        const isActive = pathname === `/categorias/${cat.slug}`
        return (
          <Link
            key={cat.id}
            href={`/categorias/${cat.slug}`}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-200 flex-shrink-0 snap-start ${
              isActive
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-foreground border-border hover:border-primary hover:text-primary'
            }`}
          >
            {categoryIcons[cat.slug] ?? '🛍️'} {cat.name}
          </Link>
        )
      })}

      {/* Pill "Promoções" */}
      <Link
        href="/produtos?promocao=true"
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-200 flex-shrink-0 snap-start ${
          searchParams.get('promocao') === 'true'
            ? 'bg-sale text-white border-sale shadow-sm'
            : 'bg-white text-foreground border-border hover:border-sale hover:text-sale'
        }`}
      >
        🔥 Promoções
      </Link>
    </div>
  )
}
