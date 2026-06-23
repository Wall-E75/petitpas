import { createClient } from '@/shared/lib/supabase'
import type { Activity } from '@/features/activites/types'
import type { AgeInMonths } from '@/features/enfant/types'

// Le service isole tous les appels Supabase. Les composants et hooks
// ne savent pas d'où viennent les données — ils appellent cette fonction.
// C'est le principe de séparation des responsabilités (SOLID — "S").

export async function getActivitiesByAge(ageInMonths: AgeInMonths): Promise<Activity[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .lte('age_min', ageInMonths)  // age_min <= ageInMonths
    .gte('age_max', ageInMonths)  // age_max >= ageInMonths
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  // La DB stocke en snake_case (age_min, is_premium...).
  // On mappe vers le camelCase de nos types TypeScript ici,
  // dans la couche service — pas dans les composants.
  return (data ?? []).map(row => ({
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
  }))
}

export async function getActivityById(id: string): Promise<Activity> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    ageMin: data.age_min,
    ageMax: data.age_max,
    duration: data.duration,
    materials: data.materials ?? [],
    benefits: data.benefits ?? [],
    difficulty: data.difficulty,
    imageUrl: data.image_url ?? undefined,
    isPremium: data.is_premium,
    createdAt: new Date(data.created_at),
  }
}
