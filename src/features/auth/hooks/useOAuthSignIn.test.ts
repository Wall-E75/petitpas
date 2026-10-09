import { renderHook, act } from '@testing-library/react'
import { useOAuthSignIn } from './useOAuthSignIn'
import { signInWithOAuth } from '../services/authService'

jest.mock('../services/authService')

const mockedSignInWithOAuth = signInWithOAuth as jest.MockedFunction<typeof signInWithOAuth>

beforeEach(() => {
  jest.resetAllMocks()
})

describe('useOAuthSignIn', () => {
  it('lance la connexion avec le provider demandé et reste en chargement', async () => {
    mockedSignInWithOAuth.mockResolvedValue(undefined)
    const { result } = renderHook(() => useOAuthSignIn())

    await act(() => result.current.signIn('google'))

    expect(mockedSignInWithOAuth).toHaveBeenCalledWith('google')
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('expose l\'erreur et réactive le bouton si Supabase échoue', async () => {
    mockedSignInWithOAuth.mockRejectedValue(new Error('Provider non activé'))
    const { result } = renderHook(() => useOAuthSignIn())

    await act(() => result.current.signIn('google'))

    expect(result.current.error).toBe('Provider non activé')
    expect(result.current.isLoading).toBe(false)
  })
})
