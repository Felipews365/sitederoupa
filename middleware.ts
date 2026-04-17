import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_CUSTOMER = ['/minha-conta', '/pedidos', '/enderecos', '/checkout']
const PROTECTED_ADMIN = ['/admin']
const PUBLIC_ADMIN = ['/admin/login']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Páginas públicas do admin (login) — deixar passar sem verificar auth
  if (PUBLIC_ADMIN.some((r) => path.startsWith(r))) {
    return NextResponse.next({ request })
  }

  // Se Supabase não estiver configurado, redirecionar /admin para /admin/login
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (PROTECTED_ADMIN.some((r) => path.startsWith(r))) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          })
        },
      },
    }
  )

  // Usar getUser() — nunca getSession() em server-side
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const needsAuth =
    PROTECTED_CUSTOMER.some((r) => path.startsWith(r)) ||
    PROTECTED_ADMIN.some((r) => path.startsWith(r))

  if (needsAuth && !user) {
    if (path.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar role admin para /admin
  if (path.startsWith('/admin') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Redirecionar usuário logado da página de login
  if (user && (path === '/login' || path === '/cadastro')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)).*)',
  ],
}
