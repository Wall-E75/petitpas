'use client'

import { useChildStore } from '@/store/childStore'
import { useAgeInMonths } from '@/features/enfant/hooks/useAgeInMonths'
import ActivityDetails from './ActivityDetails'
import ButtonAskAi from './ButtonAskAi'
import type { Activity } from '@/features/activites/types'

interface Props {
  activity: Activity
}

export default function ActivityDetailClient({ activity }: Props) {
  const child = useChildStore((state) => state.child)

  if (!child) return null

  // Même pattern que HomePageClient : on délègue à un sous-composant pour
  // appeler useAgeInMonths inconditionnellement (règle des hooks).
  return <ActivityDetailWithAge activity={activity} birthDate={child.birthDate} />
}

function ActivityDetailWithAge({ activity, birthDate }: { activity: Activity; birthDate: Date }) {
  const ageInMonths = useAgeInMonths(birthDate)

  return (
    <>
      <ActivityDetails activity={activity} />
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <ButtonAskAi activity={activity} ageInMonths={ageInMonths} />
      </div>
    </>
  )
}
