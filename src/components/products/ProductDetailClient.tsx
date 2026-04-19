'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ProductWithDetails, ProductVariant } from '@/types/database'
import { toast } from 'sonner'
import { SIZES } from '@/lib/constants'

interface ProductDetailClientProps {
  product: ProductWithDetails
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) ?? []
  const variants = product.product_variants ?? []
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))]
  const sizes = SIZES.filter((s) => variants.some((v) => v.size === s))

  const firstVariant = variants[0]

  const [selectedSize, setSelectedSize] = useState<string | null>(firstVariant?.size ?? null)
  const [selectedColor, setSelectedColor] = useState<string | null>(firstVariant?.color ?? null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = null
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const delta = (touchStartX.current ?? 0) - (touchEndX.current ?? 0)
    if (Math.abs(delta) < 40 || images.length <= 1) return
    if (delta > 0) {
      setSelectedImage((i) => (i + 1) % images.length)
    } else {
      setSelectedImage((i) => (i - 1 + images.length) % images.length)
    }
  }

  const selectedVariant = variants.find(
    (v) =>
      (sizes.length === 0 || v.size === selectedSize) &&
      (colors.length === 0 || v.color === selectedColor)
  )

  const inStock = selectedVariant ? selectedVariant.stock > 0 : false
  const stockCount = selectedVariant?.stock ?? 0

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Selecione tamanho e cor antes de adicionar')
      return
    }
    if (!inStock) {
      toast.error('Item sem estoque')
      return
    }

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      productImage: images[0]?.url ?? '',
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: product.price,
      quantity,
    })
    toast.success(`${product.name} adicionado ao carrinho!`)
  }

  const isVariantAvailable = (v: Partial<ProductVariant>) => {
    return variants.some(
      (variant) =>
        (!v.size || variant.size === v.size) &&
        (!v.color || variant.color === v.color) &&
        variant.stock > 0
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Início</Link>
        <span>/</span>
        <Link href="/produtos" className="hover:text-foreground">Produtos</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link href={`/categorias/${product.categories.slug}`} className="hover:text-foreground">
              {product.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground truncate max-w-48">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Galeria de imagens */}
        <div>
          {/* Imagem principal */}
          <div
            className="relative aspect-square bg-muted rounded-xl overflow-hidden mb-3"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {images.length > 0 ? (
              <>
                <Image
                  src={images[selectedImage]?.url ?? images[0].url}
                  alt={images[selectedImage]?.alt_text ?? product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((i) => (i + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <ShoppingBag className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === selectedImage ? 'border-primary' : 'border-border hover:border-muted-foreground'}`}
                >
                  <Image src={img.url} alt={img.alt_text ?? ''} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info do produto */}
        <div>
          {product.categories && (
            <Link href={`/categorias/${product.categories.slug}`}>
              <Badge variant="outline" className="mb-3 hover:bg-muted cursor-pointer">
                {product.categories.name}
              </Badge>
            </Link>
          )}

          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            {product.name}
          </h1>

          <PriceDisplay
            price={product.price}
            comparePrice={product.compare_price}
            size="lg"
          />

          <p className="text-sm text-muted-foreground mt-1 mb-6">
            à vista no PIX
          </p>

          {product.description && (
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Seletor de cor */}
          {colors.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">
                Cor: <span className="text-muted-foreground font-normal">{selectedColor}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => {
                  const v = variants.find((v) => v.color === color)
                  const available = isVariantAvailable({ color: color ?? undefined, size: selectedSize ?? undefined })
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      disabled={!available}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-white'
                          : available
                          ? 'border-border hover:border-primary'
                          : 'border-border text-muted-foreground opacity-50 cursor-not-allowed line-through'
                      }`}
                    >
                      {v?.color_hex && (
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-1 border border-border align-middle"
                          style={{ backgroundColor: v.color_hex }}
                        />
                      )}
                      {color}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Seletor de tamanho */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">
                Tamanho: <span className="text-muted-foreground font-normal">{selectedSize}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => {
                  const available = isVariantAvailable({ size, color: selectedColor ?? undefined })
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!available}
                      className={`w-14 h-10 rounded-lg border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : available
                          ? 'border-border hover:border-primary'
                          : 'border-border text-muted-foreground opacity-50 cursor-not-allowed line-through'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Estoque */}
          {selectedVariant && (
            <p className={`text-sm mb-4 ${inStock ? 'text-success' : 'text-destructive'}`}>
              {inStock
                ? stockCount <= 5
                  ? `Apenas ${stockCount} unidades restantes!`
                  : 'Em estoque'
                : 'Sem estoque'}
            </p>
          )}

          {/* Quantidade */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-muted transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
                className="px-3 py-2 hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Botão adicionar */}
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || !selectedVariant}
            className="w-full"
            size="lg"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            {inStock ? 'Adicionar ao Carrinho' : 'Esgotado'}
          </Button>

          {/* Detalhes */}
          {(product.brand || product.material || product.gender) && (
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold mb-3">Informações</h3>
              <dl className="space-y-2 text-sm">
                {product.brand && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground w-20">Marca:</dt>
                    <dd>{product.brand}</dd>
                  </div>
                )}
                {product.material && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground w-20">Material:</dt>
                    <dd>{product.material}</dd>
                  </div>
                )}
                {product.gender && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground w-20">Gênero:</dt>
                    <dd className="capitalize">{product.gender}</dd>
                  </div>
                )}
                {product.sku && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground w-20">SKU:</dt>
                    <dd>{product.sku}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
