import { createClient } from '@/shared/lib/supabase'
import type { Activity } from '@/features/activites/types'
import type { AgeInMonths } from '@/features/enfant/types'

// Le service isole tous les appels Supabase. Les composants et hooks
// ne savent pas d'où viennent les données — ils appellent cette fonction.
// C'est le principe de séparation des responsabilités (SOLID — "S").

// Forme brute d'une ligne `activities` telle que Supabase la renvoie
// (snake_case, pas encore mappée vers nos types applicatifs camelCase).
interface ActivityRow {
  id: string
  title: string
  description: string
  age_min: number
  age_max: number
  duration: number
  materials: string[] | null
  benefits: Activity['benefits']
  difficulty: Activity['difficulty']
  image_url: string | null
  is_premium: boolean
  created_at: string
}

// La DB stocke en snake_case (age_min, is_premium...). On mappe vers le
// camelCase de nos types TypeScript ici, une seule fois, dans la couche
// service — pas dans les composants, et pas dupliqué à chaque requête.
function mapRowToActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    ageMin: row.age_min,
    ageMax: row.age_max,
    duration: row.duration,
    materials: row.materials ?? [],
    benefits: row.benefits ?? [],
    difficulty: row.difficulty,
    imageUrl: row.image_url ?? undefined,
    isPremium: row.is_premium,
    createdAt: new Date(row.created_at),
  }
}

export async function getActivitiesByAge(ageInMonths: AgeInMonths): Promise<Activity[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .lte('age_min', ageInMonths)  // age_min <= ageInMonths
    .gte('age_max', ageInMonths)  // age_max >= ageInMonths
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []).map(mapRowToActivity)
}

export async function getActivityById(id: string): Promise<Activity> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)

  return mapRowToActivity(data)
}

export async function getActivitiesByIds(ids: string[]): Promise<Activity[]> {
  if (ids.length === 0) return []

  const supabase = createClient()

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .in('id', ids)

  if (error) throw new Error(error.message)

  return (data ?? []).map(mapRowToActivity)
}
