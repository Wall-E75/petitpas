import { useState, useEffect, useCallback } from 'react'
import { getFavorites, addFavorite, removeFavorite } from '@/features/favoris/services/favoritesService'

// MVP sans auth complète : userId fixe. À remplacer par l'id de l'utilisateur
// Supabase Auth connecté une fois l'authentification branchée sur le projet.
const TEMP_USER_ID = 'anonymous'

interface UseFavoritesResult {
  favorites: string[]
  isLoading: boolean
  error: string | null
  isFavorite: (activityId: string) => boolean
  toggleFavorite: (activityId: string) => Promise<void>
}

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getFavorites(TEMP_USER_ID)
        if (!cancelled) setFavorites(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur inattendue')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const isFavorite = useCallback(
    (activityId: string) => favorites.includes(activityId),
    [favorites]
  )

  const toggleFavorite = useCallback(async (activityId: string) => {
    const wasFavorite = favorites.includes(activityId)

    // Optimistic update : on met à jour le state local avant même la réponse
    // Supabase, pour que FavoriteButton reflète le changement instantanément.
    setFavorites(current =>
      wasFavorite ? current.filter(id => id !== activityId) : [...current, activityId]
    )

    try {
      if (wasFavorite) {
        await removeFavorite(TEMP_USER_ID, activityId)
      } else {
        await addFavorite(TEMP_USER_ID, activityId)
      }
    } catch (err) {
      // Rollback si Supabase échoue : on remet le state comme avant le clic
      setFavorites(current =>
        wasFavorite ? [...current, activityId] : current.filter(id => id !== activityId)
      )
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    }
  }, [favorites])

  return { favorites, isLoading, error, isFavorite, toggleFavorite }
}
