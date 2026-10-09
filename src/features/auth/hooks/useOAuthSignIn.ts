import { useState } from 'react'
import { signInWithOAuth } from '@/features/auth/services/authService'
import type { OAuthProvider } from '@/features/auth/types'

interface UseOAuthSignInResult {
  signIn: (provider: OAuthProvider) => Promise<void>
  isLoading: boolean
  error: string | null
}

// Contrairement à useLogin, pas de router.push : en cas de succès c'est
// Supabase qui quitte la page pour aller chez le provider.
export function useOAuthSignIn(): UseOAuthSignInResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function signIn(provider: OAuthProvider) {
    setIsLoading(true)
    setError(null)

    try {
      await signInWithOAuth(provider)
      // isLoading reste à true : la page est sur le point d'être quittée.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
      setIsLoading(false)
    }
  }

  return { signIn, isLoading, error }
}
