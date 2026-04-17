'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { formatCPF, formatPhone } from '@/lib/utils'
import { toast } from 'sonner'
import type { Profile } from '@/types/database'

const profileSchema = z.object({
  full_name: z.string().min(3, 'Nome obrigatório'),
  phone: z.string().optional(),
  cpf: z.string().optional(),
})

type ProfileInput = z.infer<typeof profileSchema>

export default function MinhaContaPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data as Profile)
        reset({
          full_name: data.full_name ?? '',
          phone: data.phone ?? '',
          cpf: data.cpf ?? '',
        })
      }
    })
  }, [reset])

  const onSubmit = async (data: ProfileInput) => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: data.full_name, phone: data.phone, cpf: data.cpf })
      .eq('id', user.id)

    if (error) {
      toast.error('Erro ao salvar. Tente novamente.')
    } else {
      toast.success('Perfil atualizado!')
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Minha Conta</h1>

      <div className="bg-white rounded-xl border border-border p-6">
        <h2 className="font-semibold text-foreground mb-5">Dados pessoais</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="full_name">Nome completo</Label>
            <Input id="full_name" placeholder="Seu nome" className="mt-1.5" {...register('full_name')} />
            {errors.full_name && <p className="text-xs text-destructive mt-1">{errors.full_name.message}</p>}
          </div>

          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              maxLength={14}
              className="mt-1.5"
              {...register('cpf')}
              onChange={(e) => setValue('cpf', formatCPF(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              maxLength={15}
              className="mt-1.5"
              {...register('phone')}
              onChange={(e) => setValue('phone', formatPhone(e.target.value))}
            />
          </div>

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </form>
      </div>
    </div>
  )
}
