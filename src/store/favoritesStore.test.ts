import { useFavoritesStore } from './favoritesStore'
import { getFavorites, addFavorite, removeFavorite } from '@/features/favoris/services/favoritesService'
import { createClient } from '@/shared/lib/supabase'

// On mocke le service : le store doit être testable sans vrai appel Supabase,
// seulement en contrôlant si la Promise se résout ou est rejetée.
// jest.mock() résout son chemin via le résolveur Jest (pas le compilateur
// SWC de Next.js), qui ne connaît pas l'alias @/ : on utilise un chemin
// relatif ici, contrairement à l'import ci-dessus qui fonctionne avec @/.
jest.mock('../features/favoris/services/favoritesService')

// Le store lit désormais l'identité via createClient().auth.getSession() :
// on mocke aussi cette frontière pour piloter la présence d'une session.
jest.mock('../shared/lib/supabase')

const mockedGetFavorites = getFavorites as jest.MockedFunction<typeof getFavorites>
const mockedAddFavorite = addFavorite as jest.MockedFunction<typeof addFavorite>
const mockedRemoveFavorite = removeFavorite as jest.MockedFunction<typeof removeFavorite>
const mockedCreateClient = createClient as jest.MockedFunction<typeof createClient>

const mockGetSession = jest.fn()

// On ne simule que la partie auth.getSession() du client, seule utilisée ici.
function mockSession(userId: string | null) {
  mockGetSession.mockResolvedValue({
    data: { session: userId ? { user: { id: userId } } : null },
  })
}

// Laisse la file des microtâches se vider : utile pour observer le state
// après le getSession() async mais avant la résolution du service.
const flushMicrotasks = () => new Promise<void>(resolve => setTimeout(resolve, 0))

// Un store Zustand est un singleton : son state persiste entre les tests
// tant qu'on ne le réinitialise pas explicitement.
const initialState = useFavoritesStore.getState()

beforeEach(() => {
  useFavoritesStore.setState(initialState, true)
  jest.resetAllMocks()
  mockedCreateClient.mockReturnValue({
    auth: { getSession: mockGetSession },
  } as unknown as ReturnType<typeof createClient>)
  mockSession('user-123')
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

    it('ne charge rien et garde une liste vide sans session Supabase', async () => {
      mockSession(null)
      mockedGetFavorites.mockResolvedValue(['activity-1'])

      await useFavoritesStore.getState().loadFavorites()

      expect(mockedGetFavorites).not.toHaveBeenCalled()
      expect(useFavoritesStore.getState().favorites).toEqual([])
    })
  })

  describe('toggleFavorite', () => {
    it('ajoute un favori en optimistic update puis confirme via le service', async () => {
      // On garde le contrôle de la résolution du service pour observer le
      // state pendant que l'appel est encore en cours.
      let confirmAdd: () => void = () => {}
      mockedAddFavorite.mockReturnValue(new Promise<void>(resolve => { confirmAdd = resolve }))

      const promise = useFavoritesStore.getState().toggleFavorite('activity-1')

      // L'optimistic update a lieu dès que la session est résolue (getSession
      // est async), mais toujours avant la confirmation du service.
      await flushMicrotasks()
      expect(useFavoritesStore.getState().favorites).toEqual(['activity-1'])
      expect(mockedAddFavorite).toHaveBeenCalledWith('user-123', 'activity-1')

      confirmAdd()
      await promise
      expect(useFavoritesStore.getState().favorites).toEqual(['activity-1'])
    })

    it('retire un favori déjà présent', async () => {
      useFavoritesStore.setState({ favorites: ['activity-1'] })
      mockedRemoveFavorite.mockResolvedValue(undefined)

      await useFavoritesStore.getState().toggleFavorite('activity-1')

      expect(mockedRemoveFavorite).toHaveBeenCalledWith('user-123', 'activity-1')
      expect(useFavoritesStore.getState().favorites).toEqual([])
    })

    it('ne fait rien sans session Supabase', async () => {
      mockSession(null)

      await useFavoritesStore.getState().toggleFavorite('activity-1')

      expect(mockedAddFavorite).not.toHaveBeenCalled()
      expect(useFavoritesStore.getState().favorites).toEqual([])
    })

    it('annule l\'optimistic update si le service échoue (rollback)', async () => {
      mockedAddFavorite.mockRejectedValue(new Error('Erreur réseau'))

      await useFavoritesStore.getState().toggleFavorite('activity-1')

      expect(useFavoritesStore.getState().favorites).toEqual([])
      expect(useFavoritesStore.getState().error).toBe('Erreur réseau')
    })
  })

  describe('clearFavorites', () => {
    it('vide la liste et remet hasLoaded à false', () => {
      useFavoritesStore.setState({ favorites: ['activity-1'], hasLoaded: true })

      useFavoritesStore.getState().clearFavorites()

      expect(useFavoritesStore.getState().favorites).toEqual([])
      expect(useFavoritesStore.getState().hasLoaded).toBe(false)
    })

    it('permet un nouveau chargement après le reset', async () => {
      mockedGetFavorites.mockResolvedValue(['activity-1'])
      await useFavoritesStore.getState().loadFavorites()

      useFavoritesStore.getState().clearFavorites()
      mockedGetFavorites.mockResolvedValue(['activity-2'])
      await useFavoritesStore.getState().loadFavorites()

      expect(mockedGetFavorites).toHaveBeenCalledTimes(2)
      expect(useFavoritesStore.getState().favorites).toEqual(['activity-2'])
    })
  })
})
