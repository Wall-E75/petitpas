import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/features/auth/services/authService'
import type { AuthCredentials } from '@/features/auth/types'

interface UseRegisterResult {
  register: (credentials: AuthCredentials) => Promise<void>
  isLoading: boolean
  error: string | null
}

// Jumeau de useLogin : même structure d'état, mais redirige vers /login au
// lieu de l'accueil. On garde deux hooks distincts plutôt qu'un seul
// paramétré — la duplication est de ~10 lignes et chaque hook reste lisible.
// Si un troisième cas apparaît (reset password...), on extraira un
// `useAsyncAction` générique (règle de trois).
export function useRegister(): UseRegisterResult {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function register(credentials: AuthCredentials) {
    setIsLoading(true)
    setError(null)

    try {
      await signUp(credentials)
      // L'énoncé demande un retour vers la connexion après inscription.
      // Selon la config Supabase, la session peut déjà être active ici ;
      // on redirige quand même vers /login pour un parcours explicite.
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
      setIsLoading(false)
    }
  }

  return { register, isLoading, error }
}
