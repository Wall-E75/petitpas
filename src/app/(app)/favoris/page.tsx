'use client'

// Client Component : useFavorites lit et met à jour du state React
// (favoris chargés au montage, mis à jour par les clics sur FavoriteButton
// ailleurs dans l'app). Un Server Component ne peut pas faire ça.

import { useEffect, useState } from 'react'
import { useFavorites } from '@/features/favoris/hooks/useFavorites'
import { getActivitiesByIds } from '@/features/activites/services/activitiesService'
import ActivityCard from '@/features/activites/components/ActivityCard'
import type { Activity } from '@/features/activites/types'

export default function FavorisPage() {
  const { favorites, isLoading: isLoadingFavorites } = useFavorites()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Tant que la liste d'ids favoris n'a pas fini de charger, on attend —
    // sinon on lancerait un fetch avec un tableau vide à chaque montage.
    if (isLoadingFavorites) return

    let cancelled = false

    async function load() {
      setIsLoadingActivities(true)
      setError(null)
      try {
        const data = await getActivitiesByIds(favorites)
        if (!cancelled) setActivities(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur inattendue')
        }
      } finally {
        if (!cancelled) setIsLoadingActivities(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [favorites, isLoadingFavorites])

  if (isLoadingFavorites || isLoadingActivities) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl bg-zinc-100" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-red-500">
        Impossible de charger vos favoris : {error}
      </p>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-lg font-semibold text-zinc-900">Aucun favori pour l&apos;instant</p>
        <p className="text-sm text-zinc-500">
          Explorez les activités et appuyez sur le cœur pour les retrouver ici.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {activities.map(activity => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  )
}
