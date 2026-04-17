'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { SIZES } from '@/lib/constants'

export interface Variant {
  size: string
  color: string
  color_hex: string
  stock: number
  sku: string
}

interface VariantManagerProps {
  variants: Variant[]
  onChange: (variants: Variant[]) => void
}

const emptyVariant = (): Variant => ({
  size: '',
  color: '',
  color_hex: '',
  stock: 0,
  sku: '',
})

export function VariantManager({ variants, onChange }: VariantManagerProps) {
  const addRow = () => onChange([...variants, emptyVariant()])

  const removeRow = (index: number) => onChange(variants.filter((_, i) => i !== index))

  const updateRow = (index: number, field: keyof Variant, value: string | number) => {
    onChange(variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)))
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-3 text-muted-foreground font-medium">Tamanho</th>
              <th className="text-left py-2 pr-3 text-muted-foreground font-medium">Cor</th>
              <th className="text-left py-2 pr-3 text-muted-foreground font-medium w-16">Hex</th>
              <th className="text-left py-2 pr-3 text-muted-foreground font-medium w-24">Estoque</th>
              <th className="text-left py-2 pr-3 text-muted-foreground font-medium">SKU</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {variants.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-muted-foreground text-sm">
                  Nenhuma variante. Clique em &quot;Adicionar variante&quot;.
                </td>
              </tr>
            )}
            {variants.map((v, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-2 pr-3">
                  <select
                    value={v.size}
                    onChange={(e) => updateRow(i, 'size', e.target.value)}
                    className="h-9 w-full rounded-lg border border-border px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">—</option>
                    {SIZES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-3">
                  <Input
                    value={v.color}
                    onChange={(e) => updateRow(i, 'color', e.target.value)}
                    placeholder="Preto"
                    className="h-9"
                  />
                </td>
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-1">
                    <input
                      type="color"
                      value={v.color_hex || '#000000'}
                      onChange={(e) => updateRow(i, 'color_hex', e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer border border-border p-0.5"
                    />
                  </div>
                </td>
                <td className="py-2 pr-3">
                  <Input
                    type="number"
                    min={0}
                    value={v.stock}
                    onChange={(e) => updateRow(i, 'stock', Number(e.target.value))}
                    className="h-9"
                  />
                </td>
                <td className="py-2 pr-3">
                  <Input
                    value={v.sku}
                    onChange={(e) => updateRow(i, 'sku', e.target.value)}
                    placeholder="SKU-001"
                    className="h-9"
                  />
                </td>
                <td className="py-2">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 flex items-center gap-1 text-sm text-accent hover:underline"
      >
        <Plus className="w-4 h-4" /> Adicionar variante
      </button>
    </div>
  )
}
