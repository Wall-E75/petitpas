import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/features/auth/services/authService'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useChildStore } from '@/store/childStore'

interface UseLogoutResult {
  logout: () => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useLogout(): UseLogoutResult {
  const router = useRouter()
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites)
  const clearChild = useChildStore((state) => state.clearChild)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function logout() {
    setIsLoading(true)
    setError(null)

    try {
      await signOut()
      // Les stores Zustand survivent à la navigation client : sans ce reset,
      // le prochain compte connecté sur ce navigateur verrait l'enfant et les
      // favoris du précédent. On ne vide qu'après un signOut réussi, pour ne
      // pas afficher un état "déconnecté" alors que la session existe encore.
      clearFavorites()
      clearChild()
      router.push('/login')
      // Même raison que dans useLogin : les Server Components doivent être
      // re-rendus sans le cookie de session.
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
      setIsLoading(false)
    }
  }

  return { logout, isLoading, error }
}
