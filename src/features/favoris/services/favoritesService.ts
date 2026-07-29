import { createClient } from '@/shared/lib/supabase'

// Même principe que activitiesService : ce fichier isole les appels Supabase
// à la table `favorites`. Les hooks ne savent pas comment les favoris sont
// stockés, seulement qu'ils peuvent appeler ces 3 fonctions.

export async function getFavorites(userId: string): Promise<string[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('favorites')
    .select('activity_id')
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  return (data ?? []).map(row => row.activity_id)
}

export async function addFavorite(userId: string, activityId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, activity_id: activityId })

  if (error) throw new Error(error.message)
}

export async function removeFavorite(userId: string, activityId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('activity_id', activityId)

  if (error) throw new Error(error.message)
}
