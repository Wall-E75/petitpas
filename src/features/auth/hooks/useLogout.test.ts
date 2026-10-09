import { renderHook, act } from '@testing-library/react'
import { useLogout } from './useLogout'
import { signOut } from '../services/authService'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useChildStore } from '@/store/childStore'
import type { ChildProfile } from '@/features/enfant/types'

jest.mock('../services/authService')

// useRouter n'existe que dans un vrai rendu Next.js : on le remplace par des
// fonctions espionnes pour vérifier la redirection.
const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

const mockedSignOut = signOut as jest.MockedFunction<typeof signOut>

const loggedInChild: ChildProfile = {
  id: 'child-1',
  userId: 'user-123',
  name: 'Léa',
  birthDate: new Date('2025-01-01'),
  createdAt: new Date('2025-01-01'),
}

beforeEach(() => {
  jest.resetAllMocks()
  useFavoritesStore.setState({ favorites: ['activity-1'], hasLoaded: true })
  useChildStore.setState({ child: loggedInChild })
})

describe('useLogout', () => {
  it('déconnecte, vide les stores et redirige vers /login', async () => {
    mockedSignOut.mockResolvedValue(undefined)
    const { result } = renderHook(() => useLogout())

    await act(() => result.current.logout())

    expect(mockedSignOut).toHaveBeenCalledTimes(1)
    expect(useFavoritesStore.getState().favorites).toEqual([])
    expect(useFavoritesStore.getState().hasLoaded).toBe(false)
    expect(useChildStore.getState().child).toBeNull()
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('garde les stores intacts et expose l\'erreur si signOut échoue', async () => {
    mockedSignOut.mockRejectedValue(new Error('Erreur réseau'))
    const { result } = renderHook(() => useLogout())

    await act(() => result.current.logout())

    expect(result.current.error).toBe('Erreur réseau')
    expect(result.current.isLoading).toBe(false)
    expect(useFavoritesStore.getState().favorites).toEqual(['activity-1'])
    expect(useChildStore.getState().child).toEqual(loggedInChild)
    expect(mockPush).not.toHaveBeenCalled()
  })
})
