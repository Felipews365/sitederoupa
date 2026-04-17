'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth'
import { forgotPassword } from '@/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function EsqueciSenhaPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true)
    const result = await forgotPassword(data.email)
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-border p-8 text-center">
        <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
        <h1 className="font-display text-xl font-bold mb-2">Email enviado!</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
        </p>
        <Link href="/login" className="text-accent text-sm font-medium hover:underline">
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-border p-8">
      <h1 className="font-display text-2xl font-bold text-center mb-2">
        Esqueci minha senha
      </h1>
      <p className="text-muted-foreground text-center text-sm mb-8">
        Digite seu email e enviaremos um link para redefinir sua senha.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {loading ? 'Enviando...' : 'Enviar link de recuperação'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
          ← Voltar ao login
        </Link>
      </div>
    </div>
  )
}
