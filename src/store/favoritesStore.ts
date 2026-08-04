import { create } from 'zustand'
import { getFavorites, addFavorite, removeFavorite } from '@/features/favoris/services/favoritesService'

// MVP sans auth complète : userId fixe. À remplacer par l'id de l'utilisateur
// Supabase Auth connecté une fois l'authentification branchée sur le projet.
const TEMP_USER_ID = 'anonymous'

interface FavoritesStore {
  favorites: string[]
  isLoading: boolean
  error: string | null
  hasLoaded: boolean
  loadFavorites: () => Promise<void>
  toggleFavorite: (activityId: string) => Promise<void>
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,
  hasLoaded: false,

  loadFavorites: async () => {
    // hasLoaded/isLoading évitent un rechargement à chaque montage : plusieurs
    // composants (FavoriteButton, page favoris...) peuvent appeler cette
    // action en même temps puisque le store est partagé entre eux.
    if (get().hasLoaded || get().isLoading) return

    set({ isLoading: true, error: null })
    try {
      const data = await getFavorites(TEMP_USER_ID)
      set({ favorites: data, isLoading: false, hasLoaded: true })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erreur inattendue', isLoading: false })
    }
  },

  toggleFavorite: async (activityId) => {
    const wasFavorite = get().favorites.includes(activityId)

    // Optimistic update : on met à jour le store avant même la réponse
    // Supabase, pour que tous les composants abonnés reflètent le changement
    // instantanément.
    set({
      favorites: wasFavorite
        ? get().favorites.filter(id => id !== activityId)
        : [...get().favorites, activityId],
    })

    try {
      if (wasFavorite) {
        await removeFavorite(TEMP_USER_ID, activityId)
      } else {
        await addFavorite(TEMP_USER_ID, activityId)
      }
    } catch (err) {
      // Rollback si Supabase échoue : on remet le state comme avant le clic
      set(state => ({
        favorites: wasFavorite
          ? [...state.favorites, activityId]
          : state.favorites.filter(id => id !== activityId),
        error: err instanceof Error ? err.message : 'Erreur inattendue',
      }))
    }
  },
}))
