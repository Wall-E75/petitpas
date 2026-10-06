import { createClient } from '@/shared/lib/supabase'
import type { ChildFormData, ChildProfile, ChildRow } from '@/features/enfant/types'

// Conversion snake_case (DB) → camelCase (TypeScript) + string → Date
function toChildProfile(row: ChildRow): ChildProfile {
  return {
    id: row.id,
    userId: row.user_id ?? '',
    name: row.name,
    birthDate: new Date(row.birth_date),
    createdAt: new Date(row.created_at),
  }
}

export async function saveChild(data: ChildFormData): Promise<ChildProfile> {
  const supabase = createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Utilisateur non connecté')

  const { data: row, error } = await supabase
    .from('children')
    .insert({
      name: data.name,
      birth_date: data.birthDate,
      user_id: session.user.id,
    })
    .select()
    .single()
  // .select().single() récupère la ligne insérée avec son id généré par Supabase.
  // Sans .select(), on n'obtient pas l'id — on ne pourrait pas construire ChildProfile.

  if (error) throw new Error(error.message)

  return toChildProfile(row)
}

export async function getChildByUserId(userId: string): Promise<ChildProfile | null> {
  const supabase = createClient()

  // maybeSingle() plutôt que single() : l'absence d'enfant est un cas normal
  // (premier passage), pas une erreur. limit(1) protège contre plusieurs
  // lignes, qui feraient échouer maybeSingle() — on garde la plus ancienne.
  const { data: row, error } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)

  return row ? toChildProfile(row) : null
}
