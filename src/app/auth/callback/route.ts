import { NextResponse, type NextRequest } from 'next/server'
import { exchangeCodeForSession } from '@/features/auth/services/authServerService'

// Hors du groupe (auth) : c'est un Route Handler sans UI, il n'a pas besoin
// du layout en carte centrée.
export async function GET(request: NextRequest) {
  // Absent si l'utilisateur a annulé sur l'écran Google : Supabase renvoie
  // alors un paramètre `error` à la place.
  const code = request.nextUrl.searchParams.get('code')
  const loginErrorUrl = new URL('/login?error=oauth', request.url)

  if (!code) return NextResponse.redirect(loginErrorUrl)

  try {
    await exchangeCodeForSession(code)
  } catch {
    return NextResponse.redirect(loginErrorUrl)
  }

  return NextResponse.redirect(new URL('/', request.url))
}
