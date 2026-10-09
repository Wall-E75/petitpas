import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Pendant serveur de createClient() : la session vit dans les cookies de la
// requête, pas dans le localStorage du navigateur.
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // Un Server Component n'a pas le droit d'écrire des cookies et
          // lèverait une erreur ici. On l'ignore : le proxy se charge alors
          // de rafraîchir la session. Dans un Route Handler, l'écriture passe.
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {}
        },
      },
    }
  )
}
