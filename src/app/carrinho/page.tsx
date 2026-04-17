'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartSheet } from '@/components/cart/CartSheet'

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
  const total = totalPrice()
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const finalTotal = total + shipping
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - total

  return (
    <>
      <Header />
      <CartSheet />
      <main className="min-h-screen bg-surface">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="font-display text-2xl font-bold mb-6">
            Carrinho {items.length > 0 && `(${items.length})`}
          </h1>

          {items.length === 0 ? (
            <div className="bg-white rounded-xl border border-border text-center py-16 px-4">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Seu carrinho está vazio</h2>
              <p className="text-muted-foreground mb-6">Explore nossa loja e encontre o que você procura!</p>
              <Button asChild>
                <Link href="/produtos">Ver produtos</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {total < FREE_SHIPPING_THRESHOLD && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                    <p className="text-sm text-accent font-medium">
                      Falta <strong>{formatCurrency(remainingForFreeShipping)}</strong> para frete grátis!
                    </p>
                    <div className="mt-1.5 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${(total / FREE_SHIPPING_THRESHOLD) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {items.map((item) => (
                  <div key={item.variantId} className="bg-white rounded-xl border border-border p-4 flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {item.productImage ? (
                        <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingBag className="w-7 h-7 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground">{item.productName}</h3>
                      {(item.size || item.color) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {[item.size, item.color].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <p className="font-bold text-accent mt-1">{formatCurrency(item.price)}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="px-3 py-1.5 hover:bg-muted transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="px-3 py-1.5 hover:bg-muted transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.variantId)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="ml-auto font-semibold text-foreground">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="bg-white rounded-xl border border-border p-5 sticky top-24">
                  <h2 className="font-semibold mb-4">Resumo</h2>
                  <div className="space-y-2 text-sm mb-5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between">
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
                  <Button className="w-full" asChild>
                    <Link href="/checkout">
                      Finalizar Compra <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Link href="/produtos" className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-3">
                    Continuar comprando
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
