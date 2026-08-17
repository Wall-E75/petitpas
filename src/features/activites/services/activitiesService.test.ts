import { createClient } from '@/shared/lib/supabase'
import { getActivitiesByAge, getActivityById } from './activitiesService'
import type { Activity } from '@/features/activites/types'

// jest.mock() résout son chemin via le résolveur Jest (pas next/jest), qui ne
// connaît pas l'alias @/ : chemin relatif ici, comme dans favoritesStore.test.ts.
jest.mock('../../../shared/lib/supabase')

const mockedCreateClient = createClient as jest.MockedFunction<typeof createClient>

// Forme brute d'une ligne `activities`, telle que mapRowToActivity la reçoit.
// On réutilise `Activity['benefits']` et `Activity['difficulty']` (indexed
// access types) plutôt que de retaper les unions à la main : si `DifficultyLevel`
// change un jour, cette fixture reste synchronisée automatiquement.
type ActivityRowFixture = {
  id: string
  title: string
  description: string
  age_min: number
  age_max: number
  duration: number
  materials: string[] | null
  benefits: Activity['benefits'] | null
  difficulty: Activity['difficulty']
  image_url: string | null
  is_premium: boolean
  created_at: string
}

function buildActivityRow(overrides: Partial<ActivityRowFixture> = {}): ActivityRowFixture {
  return {
    id: 'activity-1',
    title: 'Pile de gobelets',
    description: 'Empiler et faire tomber des gobelets en plastique.',
    age_min: 6,
    age_max: 12,
    duration: 10,
    materials: ['gobelets en plastique'],
    benefits: ['motricite_fine'],
    difficulty: 'facile',
    image_url: 'https://example.com/image.jpg',
    is_premium: false,
    created_at: '2024-01-15T10:00:00.000Z',
    ...overrides,
  }
}

type SupabaseQueryResult = { data: unknown; error: { message: string } | null }

interface MockQueryBuilder {
  select: jest.Mock
  lte: jest.Mock
  gte: jest.Mock
  eq: jest.Mock
  order: jest.Mock
  single: jest.Mock
}

// Faux query builder Supabase : select/lte/gte/eq renvoient le builder
// lui-même (chaînage façon "fluent interface"), et la dernière méthode de
// la chaîne (order pour une liste, single pour un enregistrement) renvoie
// la Promise avec le résultat final — comme le vrai client Supabase.
//
// On déclare `builder` typé AVANT de remplir ses méthodes plutôt que dans un
// seul objet littéral : un objet ne peut pas se référencer lui-même pendant
// sa propre déclaration (`select: jest.fn(() => builder)` échouerait à la
// compilation, `builder` n'existant pas encore à cet instant).
function createQueryBuilderMock(result: SupabaseQueryResult): MockQueryBuilder {
  const builder: MockQueryBuilder = {
    select: jest.fn(),
    lte: jest.fn(),
    gte: jest.fn(),
    eq: jest.fn(),
    order: jest.fn(),
    single: jest.fn(),
  }
  builder.select.mockReturnValue(builder)
  builder.lte.mockReturnValue(builder)
  builder.gte.mockReturnValue(builder)
  builder.eq.mockReturnValue(builder)
  builder.order.mockResolvedValue(result)
  builder.single.mockResolvedValue(result)
  return builder
}

// `as unknown as ...` plutôt que `as any` : on force le typage en deux temps
// (vers `unknown`, qui n'autorise aucun accès, puis vers le type cible) pour
// que le faux client satisfasse la signature de `createClient` sans jamais
// introduire `any` dans le fichier.
function mockSupabaseResponse(result: SupabaseQueryResult): MockQueryBuilder {
  const builder = createQueryBuilderMock(result)
  mockedCreateClient.mockReturnValue({
    from: jest.fn(() => builder),
  } as unknown as ReturnType<typeof createClient>)
  return builder
}

beforeEach(() => {
  jest.resetAllMocks()
})

describe('activitiesService — mapping mapRowToActivity', () => {
  describe('mapping snake_case vers camelCase', () => {
    it('mappe chaque champ snake_case vers son équivalent camelCase (getActivitiesByAge)', async () => {
      const row = buildActivityRow()
      mockSupabaseResponse({ data: [row], error: null })

      const [activity] = await getActivitiesByAge(6)

      expect(activity).toEqual({
        id: row.id,
        title: row.title,
        description: row.description,
        ageMin: row.age_min,
        ageMax: row.age_max,
        duration: row.duration,
        materials: row.materials,
        benefits: row.benefits,
        difficulty: row.difficulty,
        imageUrl: row.image_url,
        isPremium: row.is_premium,
        createdAt: new Date(row.created_at),
      })
    })

    it('mappe aussi un enregistrement unique (getActivityById)', async () => {
      const row = buildActivityRow({ id: 'activity-42', is_premium: true })
      mockSupabaseResponse({ data: row, error: null })

      const activity = await getActivityById('activity-42')

      expect(activity.id).toBe('activity-42')
      expect(activity.ageMin).toBe(row.age_min)
      expect(activity.ageMax).toBe(row.age_max)
      expect(activity.isPremium).toBe(true)
    })
  })

  describe('conversion des dates', () => {
    it('convertit created_at (string ISO) en instance de Date', async () => {
      const row = buildActivityRow({ created_at: '2023-05-20T08:30:00.000Z' })
      mockSupabaseResponse({ data: [row], error: null })

      const [activity] = await getActivitiesByAge(6)

      expect(activity.createdAt).toBeInstanceOf(Date)
      expect(activity.createdAt.toISOString()).toBe('2023-05-20T08:30:00.000Z')
    })
  })

  describe('valeurs nulles', () => {
    it('remplace materials null par un tableau vide', async () => {
      const row = buildActivityRow({ materials: null })
      mockSupabaseResponse({ data: [row], error: null })

      const [activity] = await getActivitiesByAge(6)

      expect(activity.materials).toEqual([])
    })

    it('remplace benefits null par un tableau vide', async () => {
      const row = buildActivityRow({ benefits: null })
      mockSupabaseResponse({ data: [row], error: null })

      const [activity] = await getActivitiesByAge(6)

      expect(activity.benefits).toEqual([])
    })

    it('remplace image_url null par undefined', async () => {
      const row = buildActivityRow({ image_url: null })
      mockSupabaseResponse({ data: [row], error: null })

      const [activity] = await getActivitiesByAge(6)

      expect(activity.imageUrl).toBeUndefined()
    })
  })

  describe('pas de duplication entre requêtes', () => {
    it('ne réutilise pas les résultats du précédent appel', async () => {
      mockSupabaseResponse({ data: [buildActivityRow({ id: 'activity-a' })], error: null })
      const firstResult = await getActivitiesByAge(6)

      mockSupabaseResponse({ data: [buildActivityRow({ id: 'activity-b' })], error: null })
      const secondResult = await getActivitiesByAge(6)

      expect(firstResult).toHaveLength(1)
      expect(secondResult).toHaveLength(1)
      expect(secondResult[0].id).toBe('activity-b')
      expect(secondResult[0]).not.toBe(firstResult[0])
    })

    it('mappe chaque ligne vers un objet Activity distinct, même avec des champs identiques', async () => {
      // rowA et rowB ne diffèrent que par leur id : si mapRowToActivity
      // mettait en cache un résultat par contenu, ce test le révélerait.
      const rowA = buildActivityRow({ id: 'activity-a' })
      const rowB = buildActivityRow({ id: 'activity-b' })
      mockSupabaseResponse({ data: [rowA, rowB], error: null })

      const activities = await getActivitiesByAge(6)

      expect(activities).toHaveLength(2)
      expect(activities[0]).not.toBe(activities[1])
      expect(activities[0].id).toBe('activity-a')
      expect(activities[1].id).toBe('activity-b')
    })
  })
})
