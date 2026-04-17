'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ImageUploader, type UploadedImage } from '@/components/admin/ImageUploader'
import { VariantManager, type Variant } from '@/components/admin/VariantManager'
import { createProduct, updateProduct } from '@/actions/admin/products'
import { GENDERS } from '@/lib/constants'
import { toast } from 'sonner'
import type { Category } from '@/types/database'

interface ProductFormProps {
  categories: Category[]
  initialData?: {
    id: string
    name: string
    description?: string | null
    price: number
    compare_price?: number | null
    category_id?: string | null
    brand?: string | null
    material?: string | null
    gender?: string | null
    active: boolean
    featured: boolean
    sku?: string | null
    product_images: UploadedImage[]
    product_variants: Variant[]
  }
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>(
    initialData?.product_images ?? []
  )
  const [variants, setVariants] = useState<Variant[]>(
    initialData?.product_variants?.map((v: any) => ({
      size: v.size ?? '',
      color: v.color ?? '',
      color_hex: v.color_hex ?? '',
      stock: v.stock ?? 0,
      sku: v.sku ?? '',
    })) ?? []
  )

  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price?.toString() ?? '',
    compare_price: initialData?.compare_price?.toString() ?? '',
    category_id: initialData?.category_id ?? '',
    brand: initialData?.brand ?? '',
    material: initialData?.material ?? '',
    gender: initialData?.gender ?? '',
    active: initialData?.active ?? true,
    featured: initialData?.featured ?? false,
    sku: initialData?.sku ?? '',
  })

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name) { toast.error('Nome do produto é obrigatório'); return }
    if (!form.price || isNaN(Number(form.price))) { toast.error('Preço inválido'); return }
    if (variants.length === 0) { toast.error('Adicione pelo menos uma variante (tamanho/cor/estoque)'); return }

    setLoading(true)

    const data = {
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      category_id: form.category_id || null,
      brand: form.brand || undefined,
      material: form.material || undefined,
      gender: (form.gender as any) || null,
      active: form.active,
      featured: form.featured,
      sku: form.sku || undefined,
      images,
      variants,
    }

    const result = isEdit
      ? await updateProduct(initialData!.id, data)
      : await createProduct(data)

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    toast.success(isEdit ? 'Produto atualizado!' : 'Produto criado!')
    router.push('/admin/produtos')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Info básica */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-5">Informações Básicas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Nome do produto *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ex: Camiseta Básica Algodão"
              className="mt-1.5"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Descreva o produto, tecido, modelagem..."
              rows={4}
              className="flex w-full rounded-lg border border-border bg-background px-4 py-3 text-sm mt-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <Label htmlFor="price">Preço (R$) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="99.90"
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <Label htmlFor="compare_price">Preço "de" (R$)</Label>
            <Input
              id="compare_price"
              type="number"
              step="0.01"
              min="0"
              value={form.compare_price}
              onChange={(e) => set('compare_price', e.target.value)}
              placeholder="129.90 (opcional)"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="category_id">Categoria</Label>
            <select
              id="category_id"
              value={form.category_id}
              onChange={(e) => set('category_id', e.target.value)}
              className="flex h-11 w-full rounded-lg border border-border bg-background px-4 text-sm mt-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="gender">Gênero</Label>
            <select
              id="gender"
              value={form.gender}
              onChange={(e) => set('gender', e.target.value)}
              className="flex h-11 w-full rounded-lg border border-border bg-background px-4 text-sm mt-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Não especificado</option>
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="brand">Marca</Label>
            <Input id="brand" value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="Ex: Nike" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="material">Material</Label>
            <Input id="material" value={form.material} onChange={(e) => set('material', e.target.value)} placeholder="Ex: 100% Algodão" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="Ex: CAM-001" className="mt-1.5" />
          </div>
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => set('active', e.target.checked)}
                className="w-4 h-4 accent-[#1A1A2E]"
              />
              <span className="text-sm font-medium">Produto ativo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="w-4 h-4 accent-[#1A1A2E]"
              />
              <span className="text-sm font-medium">Destaque na home</span>
            </label>
          </div>
        </div>
      </div>

      {/* Imagens */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-2">Imagens do Produto</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Adicione até 8 fotos. A imagem marcada com ★ aparece nas listagens.
        </p>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* Variantes */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-2">Tamanhos, Cores e Estoque *</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Cada combinação de tamanho + cor é uma variante com seu próprio estoque.
        </p>
        <VariantManager variants={variants} onChange={setVariants} />
      </div>

      {/* Botões */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {loading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar produto'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push('/admin/produtos')}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
