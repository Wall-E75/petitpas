import { create } from 'zustand'
import { getFavorites, addFavorite, removeFavorite } from '@/features/favoris/services/favoritesService'
import { createClient } from '@/shared/lib/supabase'

// Le store est le seul endroit qui connaît l'identité de l'utilisateur.
// Les composants et le service restent ignorants de la session : ils
// reçoivent (ou non) un userId déjà résolu.
async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user.id ?? null
}

interface FavoritesStore {
  favorites: string[]
  isLoading: boolean
  error: string | null
  hasLoaded: boolean
  loadFavorites: () => Promise<void>
  toggleFavorite: (activityId: string) => Promise<void>
  clearFavorites: () => void
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

    // Sans session, il n'y a rien à charger : on repart d'une liste vide
    // sans marquer hasLoaded, pour qu'une connexion ultérieure déclenche
    // un vrai chargement.
    const userId = await getCurrentUserId()
    if (!userId) {
      set({ favorites: [], isLoading: false })
      return
    }

    try {
      const data = await getFavorites(userId)
      set({ favorites: data, isLoading: false, hasLoaded: true })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erreur inattendue', isLoading: false })
    }
  },

  toggleFavorite: async (activityId) => {
    // Un favori est toujours rattaché à un utilisateur : sans session,
    // l'action n'a pas de sens et on sort avant tout changement de state.
    const userId = await getCurrentUserId()
    if (!userId) return

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
        await removeFavorite(userId, activityId)
      } else {
        await addFavorite(userId, activityId)
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

  // hasLoaded doit repasser à false : sinon loadFavorites() court-circuiterait
  // le chargement du prochain utilisateur connecté et afficherait une liste vide.
  clearFavorites: () => set({ favorites: [], hasLoaded: false, error: null }),
}))
