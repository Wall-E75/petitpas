import Link from 'next/link'
import type { Activity, DifficultyLevel } from '@/features/activites/types'

// Pas de 'use client' : ni state, ni event handler, ni hook.
// next/link est utilisable dans les Server Components — il n'exige pas 'use client'.

const difficultyConfig: Record<DifficultyLevel, { label: string; className: string }> = {
  facile: { label: 'Facile', className: 'bg-green-100 text-green-700' },
  moyen:  { label: 'Moyen',  className: 'bg-orange-100 text-orange-700' },
  avance: { label: 'Avancé', className: 'bg-red-100 text-red-700' },
}
// Record<DifficultyLevel, ...> garantit que les 3 valeurs sont toutes couvertes.
// TypeScript erreur si on en oublie une — c'est un exhaustiveness check implicite.

interface Props {
  activity: Activity
}

export default function ActivityCard({ activity }: Props) {
  const { label, className } = difficultyConfig[activity.difficulty]

  const description =
    activity.description.length > 100
      ? activity.description.slice(0, 100) + '…'
      : activity.description

  return (
    <Link href={`/activites/${activity.id}`} className="block">
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold leading-snug text-zinc-900">
          {activity.title}
        </h2>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
          {label}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-zinc-600">{description}</p>

      <p className="text-xs text-zinc-400">{activity.duration} min</p>
    </div>
    </Link>
  )
}
