import { getChildByUserId } from './childService'
import { createClient } from '@/shared/lib/supabase'

// Chemin relatif : jest.mock() ne connaît pas l'alias @/ (voir favoritesStore.test.ts).
jest.mock('../../../shared/lib/supabase')

const mockedCreateClient = createClient as jest.MockedFunction<typeof createClient>

// Chaque méthode du query builder renvoie le builder lui-même, sauf
// maybeSingle() qui termine la chaîne : on ne pilote que son résultat.
function mockQueryResult(result: { data: unknown; error: { message: string } | null }) {
  const builder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue(result),
  }
  mockedCreateClient.mockReturnValue({
    from: jest.fn().mockReturnValue(builder),
  } as unknown as ReturnType<typeof createClient>)
  return builder
}

beforeEach(() => {
  jest.resetAllMocks()
})

describe('getChildByUserId', () => {
  it('renvoie le profil converti en camelCase avec des Date', async () => {
    mockQueryResult({
      data: {
        id: 'child-1',
        user_id: 'user-1',
        name: 'Léa',
        birth_date: '2025-03-15',
        created_at: '2025-09-01T10:00:00Z',
      },
      error: null,
    })

    const child = await getChildByUserId('user-1')

    expect(child).toEqual({
      id: 'child-1',
      userId: 'user-1',
      name: 'Léa',
      birthDate: new Date('2025-03-15'),
      createdAt: new Date('2025-09-01T10:00:00Z'),
    })
  })

  it('filtre sur le userId fourni', async () => {
    const builder = mockQueryResult({ data: null, error: null })

    await getChildByUserId('user-42')

    expect(builder.eq).toHaveBeenCalledWith('user_id', 'user-42')
  })

  it("renvoie null quand l'utilisateur n'a pas encore d'enfant", async () => {
    mockQueryResult({ data: null, error: null })

    await expect(getChildByUserId('user-1')).resolves.toBeNull()
  })

  it('lève une erreur si Supabase échoue', async () => {
    mockQueryResult({ data: null, error: { message: 'connexion perdue' } })

    await expect(getChildByUserId('user-1')).rejects.toThrow('connexion perdue')
  })
})
