import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  // Si no hay configuración de Supabase, dejar pasar
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next()
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: { session } } = await supabase.auth.getSession()

  // Rutas protegidas
  const protectedRoutes = ['/album', '/mis-cromos', '/intercambios', '/perfil']
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Si intenta acceder a ruta protegida sin sesión, redirigir a login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si está en login y ya tiene sesión, redirigir a home
  if (request.nextUrl.pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/album/:path*', '/mis-cromos/:path*', '/intercambios/:path*', '/perfil/:path*', '/login']
}
