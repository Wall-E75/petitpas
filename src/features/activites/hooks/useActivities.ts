import { useState, useEffect } from 'react'
import type { Activity } from '@/features/activites/types'
import type { AgeInMonths } from '@/features/enfant/types'
import { getActivitiesByAge } from '@/features/activites/services/activitiesService'

// Ce hook n'a pas besoin de 'use client' — la directive appartient au composant
// qui constitue la frontière Server/Client (ActivitiesView.tsx).
// Tout import d'un Client Component est automatiquement client-side.

interface UseActivitiesResult {
  activities: Activity[]
  isLoading: boolean
  error: string | null
}

export function useActivities(ageInMonths: AgeInMonths): UseActivitiesResult {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Le flag `cancelled` évite de mettre à jour le state après le démontage
    // du composant — ce qui causerait une fuite mémoire et un warning React.
    // Pattern standard pour les effets avec fetch asynchrone.
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getActivitiesByAge(ageInMonths)
        if (!cancelled) setActivities(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur inattendue')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [ageInMonths])
  // [ageInMonths] : l'effet se relance si l'âge change (ex: changement d'enfant)

  return { activities, isLoading, error }
}
