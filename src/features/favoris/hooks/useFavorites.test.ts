import { renderHook, waitFor, act } from '@testing-library/react'
import { useFavorites } from './useFavorites'
import { useFavoritesStore } from '@/store/favoritesStore'
import { getFavorites, addFavorite } from '../services/favoritesService'

// On mocke uniquement le service (la frontière avec Supabase), pas le store :
// useFavorites n'a de sens que branché sur le vrai store Zustand, donc on
// teste l'intégration hook ↔ store, comme dans favoritesStore.test.ts.
jest.mock('../services/favoritesService')

const mockedGetFavorites = getFavorites as jest.MockedFunction<typeof getFavorites>
const mockedAddFavorite = addFavorite as jest.MockedFunction<typeof addFavorite>

// Le store Zustand est un singleton partagé entre tous les tests : on le
// remet à son état initial avant chaque test pour éviter qu'un favori ajouté
// dans un test ne "fuite" vers le suivant.
const initialState = useFavoritesStore.getState()

beforeEach(() => {
  useFavoritesStore.setState(initialState, true)
  jest.resetAllMocks()
})

describe('useFavorites', () => {
  describe('isFavorite', () => {
    it('renvoie true (un booléen) quand l\'activité est dans les favoris', async () => {
      mockedGetFavorites.mockResolvedValue(['activity-1'])

      const { result } = renderHook(() => useFavorites())
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isFavorite('activity-1')).toBe(true)
      expect(typeof result.current.isFavorite('activity-1')).toBe('boolean')
    })

    it('renvoie false (un booléen) quand l\'activité n\'est pas dans les favoris', async () => {
      mockedGetFavorites.mockResolvedValue([])

      const { result } = renderHook(() => useFavorites())
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isFavorite('activity-1')).toBe(false)
      expect(typeof result.current.isFavorite('activity-1')).toBe('boolean')
    })
  })

  describe('toggleFavorite', () => {
    it('délègue au store : après le toggle, isFavorite reflète le nouvel état', async () => {
      mockedGetFavorites.mockResolvedValue([])
      mockedAddFavorite.mockResolvedValue(undefined)

      const { result } = renderHook(() => useFavorites())
      await waitFor(() => expect(result.current.isLoading).toBe(false))
      expect(result.current.isFavorite('activity-1')).toBe(false)

      await act(async () => {
        await result.current.toggleFavorite('activity-1')
      })

      expect(result.current.isFavorite('activity-1')).toBe(true)
      expect(mockedAddFavorite).toHaveBeenCalledWith('anonymous', 'activity-1')
    })
  })
})
