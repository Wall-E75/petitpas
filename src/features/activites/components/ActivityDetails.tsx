import type { Activity, DifficultyLevel, DevelopmentArea } from '@/features/activites/types'

const difficultyConfig: Record<DifficultyLevel, { label: string; className: string }> = {
  facile: { label: 'Facile', className: 'bg-green-100 text-green-700' },
  moyen: { label: 'Moyen', className: 'bg-orange-100 text-orange-700' },
  avance: { label: 'Avancé', className: 'bg-red-100 text-red-700' },
}

const developmentAreaLabels: Record<DevelopmentArea, string> = {
  motricite_fine: 'Motricité fine',
  motricite_globale: 'Motricité globale',
  langage: 'Langage',
  eveil_sensoriel: 'Éveil sensoriel',
  social_emotionnel: 'Social & émotionnel',
  creativite: 'Créativité',
}

interface Props {
  activity: Activity
}

export default function ActivityDetails({ activity }: Props) {
  const { label, className } = difficultyConfig[activity.difficulty]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold text-zinc-900">{activity.title}</h1>
        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${className}`}>
          {label}
        </span>
      </div>

      <p className="text-sm text-zinc-500 mb-6">{activity.duration} min</p>

      <p className="text-zinc-700 leading-relaxed mb-8">{activity.description}</p>

      {activity.materials.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-zinc-900 mb-2">Matériaux</h2>
          <ul className="list-disc list-inside space-y-1">
            {activity.materials.map((m) => (
              <li key={m} className="text-sm text-zinc-600">{m}</li>
            ))}
          </ul>
        </section>
      )}

      {activity.benefits.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-zinc-900 mb-2">Bénéfices</h2>
          <div className="flex flex-wrap gap-2">
            {activity.benefits.map((b) => (
              <span key={b} className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-800">
                {developmentAreaLabels[b]}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
