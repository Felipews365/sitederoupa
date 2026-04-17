'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants'
import { Button } from '@/components/ui/button'

export function CartSheet() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore()
  const total = totalPrice()
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const finalTotal = total + shipping
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - total

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [closeCart])

  // Travar scroll quando aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Painel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg text-foreground">
              Carrinho ({items.length})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de frete grátis */}
        {total < FREE_SHIPPING_THRESHOLD && total > 0 && (
          <div className="px-4 py-3 bg-accent/10 border-b border-accent/20">
            <p className="text-xs text-accent font-medium">
              Falta <strong>{formatCurrency(remainingForFreeShipping)}</strong> para frete grátis!
            </p>
            <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Itens */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground font-medium">Carrinho vazio</p>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione produtos para continuar
              </p>
              <Button
                onClick={closeCart}
                variant="primary"
                className="mt-4"
                asChild
              >
                <Link href="/produtos">Ver produtos</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-3 pb-4 border-b border-border last:border-0">
                  {/* Imagem */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {item.productName}
                    </p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {[item.size, item.color].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="text-sm font-bold text-accent mt-1">
                      {formatCurrency(item.price)}
                    </p>

                    {/* Controles de quantidade */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-7 h-7 rounded-md border border-border hover:bg-muted flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-7 h-7 rounded-md border border-border hover:bg-muted flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rodapé com totais */}
        {items.length > 0 && (
          <div className="px-4 py-4 border-t border-border bg-surface">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className={shipping === 0 ? 'text-success font-medium' : ''}>
                  {shipping === 0 ? 'Grátis' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-accent">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <Button className="w-full" asChild onClick={closeCart}>
              <Link href="/checkout">Finalizar Compra</Link>
            </Button>
            <button
              onClick={closeCart}
              className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
