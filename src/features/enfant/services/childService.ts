import { createClient } from '@/shared/lib/supabase'
import type { ChildFormData, ChildProfile } from '@/features/enfant/types'

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

  // Conversion snake_case (DB) → camelCase (TypeScript) + string → Date
  return {
    id: row.id,
    userId: row.user_id ?? '',
    name: row.name,
    birthDate: new Date(row.birth_date),
    createdAt: new Date(row.created_at),
  }
}
