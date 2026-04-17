'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { register as registerUser } from '@/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { formatCPF, formatPhone } from '@/lib/utils'

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true)
    const result = await registerUser({
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      phone: data.phone,
      cpf: data.cpf,
    })

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    toast.success('Conta criada! Verifique seu email para confirmar.')
    router.push('/login')
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-border p-8">
      <h1 className="font-display text-2xl font-bold text-center text-foreground mb-2">
        Criar conta
      </h1>
      <p className="text-muted-foreground text-center text-sm mb-8">
        Preencha seus dados para se cadastrar
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="full_name">Nome completo</Label>
          <Input
            id="full_name"
            placeholder="Seu nome completo"
            className="mt-1.5"
            {...register('full_name')}
          />
          {errors.full_name && (
            <p className="text-xs text-destructive mt-1">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="mt-1.5"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
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
          {errors.cpf && (
            <p className="text-xs text-destructive mt-1">{errors.cpf.message}</p>
          )}
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
          {errors.phone && (
            <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirm_password">Confirmar senha</Label>
          <div className="relative mt-1.5">
            <Input
              id="confirm_password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repita a senha"
              {...register('confirm_password')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-xs text-destructive mt-1">{errors.confirm_password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {loading ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Já tem conta? </span>
        <Link href="/login" className="text-accent font-medium hover:underline">
          Entrar
        </Link>
      </div>
    </div>
  )
}
