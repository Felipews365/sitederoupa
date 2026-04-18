'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { SORT_OPTIONS } from '@/lib/constants'

export function SortSelect({ value }: { value?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('ordenar', e.target.value)
    params.delete('pagina')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <select
      value={value ?? 'newest'}
      onChange={handleChange}
      className="text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
