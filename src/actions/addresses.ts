'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Address } from '@/types/database'
import type { AddressInput } from '@/lib/validations/address'

export async function getAddresses(): Promise<Address[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function createAddress(
  input: AddressInput
): Promise<{ success?: boolean; error?: string; id?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  // Se marcado como padrão, desmarcar outros
  if (input.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({ ...input, user_id: user.id })
    .select()
    .single()

  if (error) return { error: 'Erro ao salvar endereço' }

  revalidatePath('/enderecos')
  return { success: true, id: data.id }
}

export async function updateAddress(
  id: string,
  input: Partial<AddressInput>
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  if (input.is_default) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }

  const { error } = await supabase
    .from('addresses')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao atualizar endereço' }

  revalidatePath('/enderecos')
  return { success: true }
}

export async function deleteAddress(id: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Erro ao excluir endereço' }

  revalidatePath('/enderecos')
  return { success: true }
}
