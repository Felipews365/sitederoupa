'use client'

import { useState, useEffect } from 'react'
import { Plus, MapPin, Trash2, Star } from 'lucide-react'
import { getAddresses, deleteAddress, createAddress } from '@/actions/addresses'
import { addressSchema, type AddressInput } from '@/lib/validations/address'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { formatCEP } from '@/lib/utils'
import { STATES } from '@/lib/constants'
import { toast } from 'sonner'
import type { Address } from '@/types/database'

export default function EnderecosPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
  })

  useEffect(() => {
    getAddresses().then(setAddresses)
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

  const onSubmit = async (data: AddressInput) => {
    setLoading(true)
    const result = await createAddress(data)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Endereço salvo!')
      setShowForm(false)
      reset()
      const updated = await getAddresses()
      setAddresses(updated)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este endereço?')) return
    const result = await deleteAddress(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Endereço excluído')
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Endereços</h1>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Novo endereço
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="font-semibold mb-4">Novo Endereço</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="recipient">Nome do destinatário</Label>
                <Input id="recipient" className="mt-1.5" {...register('recipient')} />
                {errors.recipient && <p className="text-xs text-destructive mt-1">{errors.recipient.message}</p>}
              </div>
              <div>
                <Label htmlFor="label">Identificar como (opcional)</Label>
                <Input id="label" placeholder="Casa, Trabalho..." className="mt-1.5" {...register('label')} />
              </div>
              <div>
                <Label htmlFor="zip_code">CEP</Label>
                <Input
                  id="zip_code"
                  placeholder="00000-000"
                  maxLength={9}
                  className="mt-1.5"
                  {...register('zip_code')}
                  onChange={(e) => {
                    const formatted = formatCEP(e.target.value)
                    setValue('zip_code', formatted)
                    handleCEPLookup(formatted)
                  }}
                />
                {errors.zip_code && <p className="text-xs text-destructive mt-1">{errors.zip_code.message}</p>}
              </div>
              <div>
                <Label htmlFor="street">Rua / Logradouro</Label>
                <Input id="street" className="mt-1.5" {...register('street')} />
                {errors.street && <p className="text-xs text-destructive mt-1">{errors.street.message}</p>}
              </div>
              <div>
                <Label htmlFor="number">Número</Label>
                <Input id="number" className="mt-1.5" {...register('number')} />
                {errors.number && <p className="text-xs text-destructive mt-1">{errors.number.message}</p>}
              </div>
              <div>
                <Label htmlFor="complement">Complemento (opcional)</Label>
                <Input id="complement" placeholder="Apto, Bloco..." className="mt-1.5" {...register('complement')} />
              </div>
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input id="neighborhood" className="mt-1.5" {...register('neighborhood')} />
                {errors.neighborhood && <p className="text-xs text-destructive mt-1">{errors.neighborhood.message}</p>}
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" className="mt-1.5" {...register('city')} />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <select
                  id="state"
                  className="flex h-11 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm mt-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  {...register('state')}
                >
                  <option value="">Selecione...</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-xs text-destructive mt-1">{errors.state.message}</p>}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar endereço'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); reset() }}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de endereços */}
      {addresses.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-border p-8 text-center">
          <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">Nenhum endereço cadastrado</p>
          <p className="text-sm text-muted-foreground">Adicione um endereço para facilitar suas compras.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-xl border border-border p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {addr.label && (
                    <span className="text-xs font-semibold bg-muted px-2 py-0.5 rounded-full">
                      {addr.label}
                    </span>
                  )}
                  {addr.is_default && (
                    <span className="text-xs font-semibold text-accent flex items-center gap-1">
                      <Star className="w-3 h-3" /> Padrão
                    </span>
                  )}
                </div>
                <p className="font-medium text-sm">{addr.recipient}</p>
                <address className="not-italic text-sm text-muted-foreground">
                  {addr.street}, {addr.number}
                  {addr.complement ? ` - ${addr.complement}` : ''} · {addr.neighborhood} · {addr.city}/{addr.state} · CEP {addr.zip_code}
                </address>
              </div>
              <button
                onClick={() => handleDelete(addr.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
