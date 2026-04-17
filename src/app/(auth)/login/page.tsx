'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { login } from '@/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    const result = await login({ ...data, redirectTo })
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="password">Senha</Label>
          <Link href="/esqueci-senha" className="text-xs text-accent hover:underline">
            Esqueci minha senha
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-border p-8">
      <h1 className="font-display text-2xl font-bold text-center text-foreground mb-2">
        Entrar na sua conta
      </h1>
      <p className="text-muted-foreground text-center text-sm mb-8">
        Bem-vindo de volta!
      </p>

      <Suspense fallback={<div className="h-48 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
        <LoginForm />
      </Suspense>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Não tem conta? </span>
        <Link href="/cadastro" className="text-accent font-medium hover:underline">
          Criar conta grátis
        </Link>
      </div>
    </div>
  )
}
