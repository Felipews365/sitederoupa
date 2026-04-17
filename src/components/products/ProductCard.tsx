'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Heart, Star } from 'lucide-react'
import type { ProductWithDetails } from '@/types/database'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'
import { BorderBeam } from '@/components/magicui/border-beam'

interface ProductCardProps {
  product: ProductWithDetails
  featured?: boolean
}

const SIZES = ['P', 'M', 'G', 'GG']

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addItem } = useCartStore()
  const primaryImage = product.product_images?.find((img) => img.is_primary) ?? product.product_images?.[0]
  const hasVariants = (product.product_variants?.length ?? 0) > 1
  const firstVariant = product.product_variants?.[0]
  const inStock = product.product_variants?.some((v) => v.stock > 0)
  const discountPct = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  // Get available sizes from variants
  const availableSizes = product.product_variants
    ?.map((v) => v.size)
    .filter((s): s is string => !!s)
    .slice(0, 4) ?? SIZES

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!firstVariant || !inStock) return

    if (hasVariants) {
      window.location.href = `/produtos/${product.slug}`
      return
    }

    addItem({
      variantId: firstVariant.id,
      productId: product.id,
      productName: product.name,
      productImage: primaryImage?.url ?? '',
      size: firstVariant.size,
      color: firstVariant.color,
      price: product.price,
    })
    toast.success(`"${product.name}" adicionado à sacola!`)
  }

  return (
    <Link href={`/produtos/${product.slug}`} className="group relative">
      <div className="relative bg-white rounded-xl overflow-hidden border border-border transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-primary-hl flex flex-col">
        {featured && <BorderBeam size={150} duration={12} />}

        {/* Image */}
        <div className="relative aspect-[3/4] bg-muted overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text ?? product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-light">
              <ShoppingBag className="w-12 h-12 text-primary/30" />
            </div>
          )}

          {/* Badge desconto */}
          {discountPct && (
            <span className="badge-sale">-{discountPct}%</span>
          )}

          {/* Badge novo */}
          {!discountPct && product.featured && (
            <span className="badge-new">Novo</span>
          )}

          {/* Badge frete grátis */}
          {product.price >= 79 && (
            <span className="badge-free">Frete grátis</span>
          )}

          {/* Sem estoque */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
              <span className="bg-white text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow">
                Esgotado
              </span>
            </div>
          )}

          {/* Favoritar btn */}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-sale hover:scale-110 text-muted-foreground z-20"
            aria-label="Favoritar"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>

          {/* Size row — slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 px-3 py-2 flex items-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-20">
            <span className="text-[0.6rem] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Tam:</span>
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={(e) => e.preventDefault()}
                className="text-[0.65rem] font-semibold border border-border rounded px-1.5 py-0.5 bg-white hover:bg-primary hover:text-white hover:border-primary transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col gap-1.5 flex-1">
          {product.categories && (
            <p className="text-[0.65rem] text-muted-foreground uppercase tracking-wider">
              {product.categories.name}
            </p>
          )}

          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Price */}
          <PriceDisplay
            price={product.price}
            comparePrice={product.compare_price}
            size="sm"
          />

          {/* Installments hint */}
          {product.price >= 40 && (
            <p className="text-[0.65rem] text-muted-foreground">
              ou {Math.min(Math.floor(product.price / 20), 10)}x de R${' '}
              {(product.price / Math.min(Math.floor(product.price / 20), 10)).toFixed(2).replace('.', ',')} sem juros
            </p>
          )}

          {/* Rating placeholder */}
          <div className="flex items-center gap-1">
            <div className="flex text-gold-DEFAULT" style={{ color: '#F5A623' }}>
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-[0.65rem] text-muted-foreground">(4.9)</span>
          </div>

          {/* Add to cart btn — visible on hover */}
          <button
            onClick={handleQuickAdd}
            disabled={!inStock}
            className="mt-auto flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-bold py-2 rounded-full opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {hasVariants ? 'Selecionar tamanho' : 'Adicionar à sacola'}
          </button>
        </div>
      </div>
    </Link>
  )
}
