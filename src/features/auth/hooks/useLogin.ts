import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/features/auth/services/authService'
import type { AuthCredentials } from '@/features/auth/types'

interface UseLoginResult {
  login: (credentials: AuthCredentials) => Promise<void>
  isLoading: boolean
  error: string | null
}

// Le hook porte tout ce qui n'est pas de l'affichage : appel du service,
// état de chargement, message d'erreur, redirection après succès. Le
// composant ne fait qu'appeler `login()` et lire `isLoading` / `error`.
export function useLogin(): UseLoginResult {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function login(credentials: AuthCredentials) {
    setIsLoading(true)
    setError(null)

    try {
      await signIn(credentials)
      router.push('/')
      // refresh() revalide les Server Components avec le cookie de session
      // fraîchement posé, sans quoi ils resteraient sur leur rendu "déconnecté".
      router.refresh()
      // On ne remet pas isLoading à false : la navigation démonte le composant.
      // Le laisser à true évite que le bouton clignote "actif" avant de partir.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
