'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: {
  email: string
  password: string
  redirectTo?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Email ou senha incorretos' }
    }
    return { error: error.message }
  }

  redirect(formData.redirectTo ?? '/')
}

export async function register(formData: {
  email: string
  password: string
  full_name: string
  phone?: string
  cpf?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Este email já está cadastrado' }
    }
    return { error: error.message }
  }

  // Atualizar telefone e CPF no profile
  const { data: { user } } = await supabase.auth.getUser()
  if (user && (formData.phone || formData.cpf)) {
    await supabase
      .from('profiles')
      .update({
        phone: formData.phone,
        cpf: formData.cpf,
      })
      .eq('id', user.id)
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function forgotPassword(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}
