'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingBag, MapPin, CreditCard, ChevronRight, Plus, Loader2, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { getAddresses } from '@/actions/addresses'
import { createOrder } from '@/actions/orders'
import { formatCurrency, formatCEP } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, STATES } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { Address } from '@/types/database'
import { createAddress } from '@/actions/addresses'
import { addressSchema, type AddressInput } from '@/lib/validations/address'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type Step = 'address' | 'payment' | 'review'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()
  const [step, setStep] = useState<Step>('address')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix')
  const [placing, setPlacing] = useState(false)

  const total = totalPrice()
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const finalTotal = total + shipping

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
  })

  useEffect(() => {
    if (items.length === 0) router.push('/carrinho')
    getAddresses().then((addrs) => {
      setAddresses(addrs)
      const def = addrs.find((a) => a.is_default) ?? addrs[0]
      if (def) setSelectedAddressId(def.id)
    })
  }, [])

  const handleCEPLookup = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '')
    if (cleanCEP.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setValue('street', data.logradouro)
        setValue('neighborhood', data.bairro)
        setValue('city', data.localidade)
        setValue('state', data.uf)
      }
    } catch {}
  }

  const handleSaveNewAddress = async (data: AddressInput) => {
    const result = await createAddress(data)
    if (result.error) {
      toast.error(result.error)
      return
    }
    const updated = await getAddresses()
    setAddresses(updated)
    setSelectedAddressId(result.id!)
    setShowNewAddress(false)
    toast.success('Endereço salvo!')
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Selecione um endereço de entrega')
      return
    }
    setPlacing(true)
    const result = await createOrder(items, selectedAddressId, paymentMethod)
    if (result.error) {
      toast.error(result.error)
      setPlacing(false)
      return
    }
    clearCart()
    router.push(`/checkout/confirmacao?orderId=${result.orderId}`)
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId)

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-8">Finalizar Compra</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {([['address', 'Endereço'], ['payment', 'Pagamento'], ['review', 'Revisão']] as const).map(([s, label], i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step === s ? 'bg-primary text-white' : ((['address', 'payment', 'review'].indexOf(step) > i) ? 'bg-success text-white' : 'bg-muted text-muted-foreground')}`}>
              {['address', 'payment', 'review'].indexOf(step) > i ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${step === s ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{label}</span>
            {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* STEP 1: Endereço */}
          {step === 'address' && (
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Endereço de Entrega</h2>
              </div>

              {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'}`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-[#1A1A2E]"
                      />
                      <div className="text-sm">
                        <p className="font-medium">{addr.label ?? addr.recipient}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {addr.street}, {addr.number} — {addr.city}/{addr.state}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowNewAddress(!showNewAddress)}
                className="flex items-center gap-2 text-sm text-accent hover:underline mb-4"
              >
                <Plus className="w-4 h-4" />
                Adicionar novo endereço
              </button>

              {showNewAddress && (
                <form onSubmit={handleSubmit(handleSaveNewAddress)} className="border border-border rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <Label>Destinatário</Label>
                      <Input placeholder="Nome completo" className="mt-1" {...register('recipient')} />
                      {errors.recipient && <p className="text-xs text-destructive mt-1">{errors.recipient.message}</p>}
                    </div>
                    <div>
                      <Label>CEP</Label>
                      <Input
                        placeholder="00000-000"
                        maxLength={9}
                        className="mt-1"
                        {...register('zip_code')}
                        onChange={(e) => {
                          const v = formatCEP(e.target.value)
                          setValue('zip_code', v)
                          handleCEPLookup(v)
                        }}
                      />
                      {errors.zip_code && <p className="text-xs text-destructive mt-1">{errors.zip_code.message}</p>}
                    </div>
                    <div>
                      <Label>Número</Label>
                      <Input className="mt-1" {...register('number')} />
                      {errors.number && <p className="text-xs text-destructive mt-1">{errors.number.message}</p>}
                    </div>
                    <div>
                      <Label>Rua</Label>
                      <Input className="mt-1" {...register('street')} />
                    </div>
                    <div>
                      <Label>Complemento</Label>
                      <Input placeholder="Opcional" className="mt-1" {...register('complement')} />
                    </div>
                    <div>
                      <Label>Bairro</Label>
                      <Input className="mt-1" {...register('neighborhood')} />
                    </div>
                    <div>
                      <Label>Cidade</Label>
                      <Input className="mt-1" {...register('city')} />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <select className="flex h-11 w-full rounded-lg border border-border bg-background px-4 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/30" {...register('state')}>
                        <option value="">Selecione...</option>
                        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button type="submit" size="sm">Salvar endereço</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewAddress(false)}>Cancelar</Button>
                  </div>
                </form>
              )}

              <Button
                onClick={() => { if (selectedAddressId) setStep('payment'); else toast.error('Selecione um endereço') }}
                className="w-full"
                disabled={!selectedAddressId}
              >
                Continuar para Pagamento
              </Button>
            </div>
          )}

          {/* STEP 2: Pagamento */}
          {step === 'payment' && (
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Forma de Pagamento</h2>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { value: 'pix', label: 'PIX', desc: 'Aprovação imediata · Seguro', available: true },
                  { value: 'credit_card', label: 'Cartão de Crédito', desc: 'Em breve', available: false },
                  { value: 'boleto', label: 'Boleto Bancário', desc: 'Em breve', available: false },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${!opt.available ? 'opacity-50 cursor-not-allowed' : paymentMethod === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      disabled={!opt.available}
                      onChange={() => opt.available && setPaymentMethod(opt.value as typeof paymentMethod)}
                      className="mt-1 accent-[#1A1A2E]"
                    />
                    <div>
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('address')} className="flex-1">Voltar</Button>
                <Button onClick={() => setStep('review')} className="flex-1">Revisar Pedido</Button>
              </div>
            </div>
          )}

          {/* STEP 3: Revisão */}
          {step === 'review' && (
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="font-semibold mb-5">Revisar Pedido</h2>

              {selectedAddress && (
                <div className="p-3 bg-muted rounded-lg mb-4 text-sm">
                  <p className="font-medium flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5" /> Entrega em
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {selectedAddress.street}, {selectedAddress.number} — {selectedAddress.city}/{selectedAddress.state}
                  </p>
                </div>
              )}

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {item.productImage ? (
                        <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{[item.size, item.color].filter(Boolean).join(' · ')} · Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-accent">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('payment')} className="flex-1">Voltar</Button>
                <Button onClick={handlePlaceOrder} disabled={placing} className="flex-1">
                  {placing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {placing ? 'Processando...' : 'Confirmar Pedido'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Resumo do pedido */}
        <div>
          <div className="bg-white rounded-xl border border-border p-5 sticky top-24">
            <h2 className="font-semibold mb-4">Resumo</h2>
            <div className="space-y-2 text-sm mb-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex justify-between">
                  <span className="text-muted-foreground truncate mr-2">{item.productName} ×{item.quantity}</span>
                  <span className="flex-shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className={shipping === 0 ? 'text-success font-medium' : ''}>{shipping === 0 ? 'Grátis' : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-accent">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
