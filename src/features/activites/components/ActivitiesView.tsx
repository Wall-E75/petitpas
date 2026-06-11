'use client'

// 'use client' ici = frontière Server/Client.
// Ce composant et tout ce qu'il importe (useActivities, ActivityCard)
// seront inclus dans le bundle JavaScript envoyé au navigateur.
// La page (app/(app)/page.tsx) reste Server Component — elle rend juste <ActivitiesView />.

import { useActivities } from '@/features/activites/hooks/useActivities'
import ActivityCard from '@/features/activites/components/ActivityCard'
import type { AgeInMonths } from '@/features/enfant/types'

interface Props {
  ageInMonths: AgeInMonths
}

export default function ActivitiesView({ ageInMonths }: Props) {
  const { activities, isLoading, error } = useActivities(ageInMonths)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl bg-zinc-100" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-red-500">
        Impossible de charger les activités : {error}
      </p>
    )
  }

  if (activities.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Aucune activité trouvée pour cet âge. Revenez bientôt !
      </p>
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
