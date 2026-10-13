import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Next.js 16 a renommé la convention `middleware.ts` en `proxy.ts` : même
// fonctionnement, exécution sur le serveur avant le rendu de la route. Le
// fichier vit à la racine de `src/`, jamais dans `src/app/`.

// `/` n'y figure pas : les visiteurs non connectés y voient des activités
// pour un âge par défaut (accès freemium).
const PROTECTED_PREFIXES = ['/activites', '/favoris'] as const

export async function proxy(request: NextRequest) {
  // Réponse par défaut : la requête suit son cours. On la réassigne seulement
  // si Supabase renvoie un cookie de session rafraîchi (voir setAll).
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Pont entre le magasin de cookies de Supabase et celui de Next.
      // getAll : Supabase lit la session depuis les cookies de la requête.
      // setAll : Supabase pose une session (ré)actualisée ; on la recopie sur
      // la réponse pour que le navigateur reçoive le nouveau cookie.
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // getUser() valide le token auprès du serveur Auth de Supabase.
  // getSession() se contenterait de relire le cookie — falsifiable, donc
  // à proscrire pour une décision d'accès côté serveur.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtected = PROTECTED_PREFIXES.some(prefix =>
    request.nextUrl.pathname.startsWith(prefix)
  )

  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  // Le proxy ne s'exécute QUE sur ces routes. `/login`, `/register` et
  // `/auth/callback` n'y figurent pas : ils restent accessibles sans session.
  // `/` y reste, sans redirection, pour que le cookie de session y soit
  // rafraîchi : un Server Component ne peut pas le faire lui-même.
  // Ajouter une route protégée = l'ajouter ici ET dans PROTECTED_PREFIXES.
  matcher: ['/', '/activites/:path*', '/favoris/:path*'],
}
