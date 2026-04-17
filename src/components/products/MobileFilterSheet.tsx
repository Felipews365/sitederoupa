'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { FilterSidebar } from './FilterSidebar'

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

interface MobileFilterSheetProps {
  categories: Category[]
  availableColors: AvailableColor[]
  params: FilterParams
  activeFilterCount: number
}

export function MobileFilterSheet({
  categories,
  availableColors,
  params,
  activeFilterCount,
}: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm border border-border rounded-lg px-3 py-2 bg-white hover:bg-muted transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
        {activeFilterCount > 0 && (
          <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl max-h-[85dvh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-4 pt-4 pb-2 border-b border-border">
              <span className="font-semibold text-foreground">Filtros</span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {/* Render FilterSidebar without sticky positioning inside drawer */}
              <FilterSidebar
                categories={categories}
                availableColors={availableColors}
                params={params}
              />
            </div>
            <div className="sticky bottom-0 bg-white p-4 border-t border-border">
              <button
                onClick={() => setOpen(false)}
                className="w-full bg-primary text-white rounded-lg py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
