import { useEffect, useCallback } from 'react'
import { useFavoritesStore } from '@/store/favoritesStore'

interface UseFavoritesResult {
  favorites: string[]
  isLoading: boolean
  error: string | null
  isFavorite: (activityId: string) => boolean
  toggleFavorite: (activityId: string) => Promise<void>
}

// Ce hook ne stocke plus rien lui-même : il interroge favoritesStore (source
// unique de vérité) et déclenche le chargement initial au montage. Le
// stockage et les appels Supabase vivent désormais dans le store.
export function useFavorites(): UseFavoritesResult {
  const favorites = useFavoritesStore(state => state.favorites)
  const isLoading = useFavoritesStore(state => state.isLoading)
  const error = useFavoritesStore(state => state.error)
  const loadFavorites = useFavoritesStore(state => state.loadFavorites)
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite)

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const isFavorite = useCallback(
    (activityId: string) => favorites.includes(activityId),
    [favorites]
  )

  return { favorites, isLoading, error, isFavorite, toggleFavorite }
}
