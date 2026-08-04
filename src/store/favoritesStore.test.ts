import { useFavoritesStore } from './favoritesStore'
import { getFavorites, addFavorite, removeFavorite } from '@/features/favoris/services/favoritesService'

// On mocke le service : le store doit être testable sans vrai appel Supabase,
// seulement en contrôlant si la Promise se résout ou est rejetée.
// jest.mock() résout son chemin via le résolveur Jest (pas le compilateur
// SWC de Next.js), qui ne connaît pas l'alias @/ : on utilise un chemin
// relatif ici, contrairement à l'import ci-dessus qui fonctionne avec @/.
jest.mock('../features/favoris/services/favoritesService')

const mockedGetFavorites = getFavorites as jest.MockedFunction<typeof getFavorites>
const mockedAddFavorite = addFavorite as jest.MockedFunction<typeof addFavorite>
const mockedRemoveFavorite = removeFavorite as jest.MockedFunction<typeof removeFavorite>

// Un store Zustand est un singleton : son state persiste entre les tests
// tant qu'on ne le réinitialise pas explicitement.
const initialState = useFavoritesStore.getState()

beforeEach(() => {
  useFavoritesStore.setState(initialState, true)
  jest.resetAllMocks()
})

describe('favoritesStore', () => {
  describe('loadFavorites', () => {
    it('charge les favoris depuis le service et met à jour le state', async () => {
      mockedGetFavorites.mockResolvedValue(['activity-1', 'activity-2'])

      await useFavoritesStore.getState().loadFavorites()

      expect(useFavoritesStore.getState().favorites).toEqual(['activity-1', 'activity-2'])
      expect(useFavoritesStore.getState().isLoading).toBe(false)
      expect(useFavoritesStore.getState().hasLoaded).toBe(true)
    })

    it('ne recharge pas une deuxième fois si déjà chargé', async () => {
      mockedGetFavorites.mockResolvedValue(['activity-1'])

      await useFavoritesStore.getState().loadFavorites()
      await useFavoritesStore.getState().loadFavorites()

      expect(mockedGetFavorites).toHaveBeenCalledTimes(1)
    })

    it('stocke un message d\'erreur si le service échoue', async () => {
      mockedGetFavorites.mockRejectedValue(new Error('Erreur réseau'))

      await useFavoritesStore.getState().loadFavorites()

      expect(useFavoritesStore.getState().error).toBe('Erreur réseau')
      expect(useFavoritesStore.getState().favorites).toEqual([])
    })
  })

  describe('toggleFavorite', () => {
    it('ajoute un favori en optimistic update puis confirme via le service', async () => {
      mockedAddFavorite.mockResolvedValue(undefined)

      const promise = useFavoritesStore.getState().toggleFavorite('activity-1')

      // Juste après l'appel, avant que la Promise du service ne soit résolue,
      // le state est déjà mis à jour : c'est l'optimistic update.
      expect(useFavoritesStore.getState().favorites).toEqual(['activity-1'])

      await promise
      expect(mockedAddFavorite).toHaveBeenCalledWith('anonymous', 'activity-1')
      expect(useFavoritesStore.getState().favorites).toEqual(['activity-1'])
    })

    it('retire un favori déjà présent', async () => {
      useFavoritesStore.setState({ favorites: ['activity-1'] })
      mockedRemoveFavorite.mockResolvedValue(undefined)

      await useFavoritesStore.getState().toggleFavorite('activity-1')

      expect(mockedRemoveFavorite).toHaveBeenCalledWith('anonymous', 'activity-1')
      expect(useFavoritesStore.getState().favorites).toEqual([])
    })

    it('annule l\'optimistic update si le service échoue (rollback)', async () => {
      mockedAddFavorite.mockRejectedValue(new Error('Erreur réseau'))

      await useFavoritesStore.getState().toggleFavorite('activity-1')

      expect(useFavoritesStore.getState().favorites).toEqual([])
      expect(useFavoritesStore.getState().error).toBe('Erreur réseau')
    })
  })
})
