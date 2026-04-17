'use client'

import { useRouter, usePathname } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { SIZES, GENDERS } from '@/lib/constants'

interface Category {
  id: string
  name: string
  slug: string
}

interface AvailableColor {
  color: string
  color_hex: string | null
}

interface FilterParams {
  categoria?: string
  genero?: string
  preco_min?: string
  preco_max?: string
  tamanhos?: string
  cores?: string
  q?: string
  ordenar?: string
}

interface FilterSidebarProps {
  categories: Category[]
  availableColors: AvailableColor[]
  params: FilterParams
}

export function FilterSidebar({ categories, availableColors, params }: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  function buildUrl(overrides: Partial<FilterParams>, remove?: string[]) {
    const next: Record<string, string> = {}
    const keys = ['categoria', 'genero', 'preco_min', 'preco_max', 'tamanhos', 'cores', 'q', 'ordenar'] as const
    for (const key of keys) {
      if (remove?.includes(key)) continue
      const val = overrides[key] ?? params[key]
      if (val) next[key] = val
    }
    // apply overrides explicitly set to ''
    for (const [k, v] of Object.entries(overrides)) {
      if (v === '') delete next[k]
      else if (v) next[k] = v
    }
    const qs = new URLSearchParams(next).toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  function navigate(overrides: Partial<FilterParams>, remove?: string[]) {
    router.push(buildUrl(overrides, remove))
  }

  // Tamanhos ativos
  const activeSizes = params.tamanhos ? params.tamanhos.split(',').filter(Boolean) : []
  function toggleSize(size: string) {
    const next = activeSizes.includes(size)
      ? activeSizes.filter((s) => s !== size)
      : [...activeSizes, size]
    navigate({ tamanhos: next.join(',') || '', pagina: '' } as FilterParams & { pagina: string })
  }

  // Cores ativas
  const activeColors = params.cores ? params.cores.split(',').filter(Boolean) : []
  function toggleColor(color: string) {
    const next = activeColors.includes(color)
      ? activeColors.filter((c) => c !== color)
      : [...activeColors, color]
    navigate({ cores: next.join(',') || '', pagina: '' } as FilterParams & { pagina: string })
  }

  // Chips de filtros ativos
  const activeFilters: { label: string; removeKey?: string; removeValue?: string }[] = []
  if (params.categoria) {
    const cat = categories.find((c) => c.slug === params.categoria)
    if (cat) activeFilters.push({ label: cat.name, removeKey: 'categoria' })
  }
  if (params.genero) {
    const g = GENDERS.find((g) => g.value === params.genero)
    if (g) activeFilters.push({ label: g.label, removeKey: 'genero' })
  }
  if (params.preco_min || params.preco_max) {
    const min = params.preco_min ? `R$${params.preco_min}` : ''
    const max = params.preco_max ? `R$${params.preco_max}` : ''
    const label = min && max ? `${min} – ${max}` : min ? `≥ ${min}` : `≤ ${max}`
    activeFilters.push({ label })
  }
  for (const s of activeSizes) activeFilters.push({ label: s, removeKey: 'tamanho_item', removeValue: s })
  for (const c of activeColors) activeFilters.push({ label: c, removeKey: 'cor_item', removeValue: c })

  function removeActiveFilter(f: (typeof activeFilters)[number]) {
    if (!f.removeKey) {
      navigate({ preco_min: '', preco_max: '' })
    } else if (f.removeKey === 'tamanho_item') {
      const next = activeSizes.filter((s) => s !== f.removeValue)
      navigate({ tamanhos: next.join(',') || '' })
    } else if (f.removeKey === 'cor_item') {
      const next = activeColors.filter((c) => c !== f.removeValue)
      navigate({ cores: next.join(',') || '' })
    } else {
      navigate({ [f.removeKey]: '' })
    }
  }

  const hasAnyFilter =
    params.categoria ||
    params.genero ||
    params.preco_min ||
    params.preco_max ||
    activeSizes.length > 0 ||
    activeColors.length > 0

  // Price inputs (local state via form)
  function handlePriceSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    navigate({
      preco_min: (fd.get('preco_min') as string) || '',
      preco_max: (fd.get('preco_max') as string) || '',
      pagina: '',
    } as FilterParams & { pagina: string })
  }

  return (
    <div className="bg-white rounded-xl border border-border p-4 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">Filtros</h2>
        </div>
        {hasAnyFilter && (
          <a
            href={params.q ? `${pathname}?q=${encodeURIComponent(params.q)}` : pathname}
            className="text-xs text-accent hover:underline"
          >
            Limpar tudo
          </a>
        )}
      </div>

      {/* Chips de filtros ativos */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {activeFilters.map((f, i) => (
            <button
              key={i}
              onClick={() => removeActiveFilter(f)}
              className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-full px-2.5 py-1 hover:bg-primary/20 transition-colors"
            >
              {f.label}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {/* Categorias */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">Categorias</h3>
        <ul className="space-y-0.5">
          <li>
            <a
              href={buildUrl({ categoria: '' })}
              className={`block text-sm py-1.5 px-2 rounded-md transition-colors ${!params.categoria ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              Todos
            </a>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <a
                href={buildUrl({ categoria: cat.slug })}
                className={`block text-sm py-1.5 px-2 rounded-md transition-colors ${params.categoria === cat.slug ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
              >
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Gênero */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">Gênero</h3>
        <ul className="space-y-0.5">
          <li>
            <a
              href={buildUrl({ genero: '' })}
              className={`block text-sm py-1.5 px-2 rounded-md transition-colors ${!params.genero ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              Todos
            </a>
          </li>
          {GENDERS.map((g) => (
            <li key={g.value}>
              <a
                href={buildUrl({ genero: g.value })}
                className={`block text-sm py-1.5 px-2 rounded-md transition-colors ${params.genero === g.value ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
              >
                {g.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Faixa de Preço */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">Preço</h3>
        <form onSubmit={handlePriceSubmit} className="space-y-2">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              name="preco_min"
              placeholder="Mín"
              defaultValue={params.preco_min ?? ''}
              min={0}
              className="w-full text-sm border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span className="text-muted-foreground text-xs">–</span>
            <input
              type="number"
              name="preco_max"
              placeholder="Máx"
              defaultValue={params.preco_max ?? ''}
              min={0}
              className="w-full text-sm border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="submit"
            className="w-full text-sm bg-muted hover:bg-muted/80 text-foreground rounded-md py-1.5 transition-colors"
          >
            Aplicar
          </button>
        </form>
      </div>

      {/* Tamanhos */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">Tamanhos</h3>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => {
            const active = activeSizes.includes(size)
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                  active
                    ? 'bg-primary text-white border-primary'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-foreground'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Cores */}
      {availableColors.length > 0 && (
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-foreground mb-2">Cores</h3>
          <div className="flex flex-wrap gap-2">
            {availableColors.map(({ color, color_hex }) => {
              const active = activeColors.includes(color)
              return (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  title={color}
                  className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border transition-colors ${
                    active
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border text-muted-foreground hover:border-primary'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                    style={{ backgroundColor: color_hex ?? '#ccc' }}
                  />
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
