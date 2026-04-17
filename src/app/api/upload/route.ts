import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Verificar role admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const { fileName, contentType } = await request.json()

  if (!fileName || !contentType) {
    return NextResponse.json({ error: 'fileName e contentType são obrigatórios' }, { status: 400 })
  }

  const ext = fileName.split('.').pop()
  const filePath = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from('product-images')
    .createSignedUploadUrl(filePath)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${filePath}`

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path: filePath,
    publicUrl,
  })
}
