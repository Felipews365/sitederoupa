'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Lock, User, Eye, EyeOff, AlertCircle, Info } from 'lucide-react'
import { login } from '@/actions/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login({ email, password, redirectTo: '/admin' })
      if (result?.error) setError(result.error)
    } catch {
      setError('Não foi possível conectar. Verifique se o Supabase está configurado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-primary px-8 pt-8 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-base leading-tight">MercadoVerde</div>
                <div className="text-white/60 text-xs">Painel Administrativo</div>
              </div>
            </div>
            <h1 className="font-display text-xl font-bold text-white">Acesso Restrito</h1>
            <p className="text-white/70 text-sm mt-1">Entre com sua conta de administrador.</p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">

            {/* Setup notice */}
            <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700 leading-relaxed">
                <strong className="block mb-0.5">Supabase necessário</strong>
                Configure o <code className="bg-blue-100 px-1 rounded">.env.local</code> e defina um usuário admin via SQL antes de acessar.
                <br />
                <code className="block mt-1 bg-blue-100 px-2 py-1 rounded text-[0.65rem] leading-relaxed">
                  UPDATE profiles SET role = &apos;admin&apos;<br />
                  WHERE id = (SELECT id FROM auth.users<br />
                  WHERE email = &apos;seu@email.com&apos;);
                </code>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@exemplo.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-display font-bold text-sm py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                <Lock className="w-4 h-4" />
                {loading ? 'Entrando...' : 'Entrar no Painel'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <a href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                ← Voltar à loja
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
