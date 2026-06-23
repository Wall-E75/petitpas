'use client'

import { useSuggestion } from '@/features/ia/hooks/useSuggestion'
import type { Activity } from '@/features/activites/types'
import type { AgeInMonths } from '@/features/enfant/types'

interface Props {
  activity: Activity
  ageInMonths: AgeInMonths
}

export default function ButtonAskAi({ activity, ageInMonths }: Props) {
  const { suggestion, isLoading, error, askSuggestion } = useSuggestion()

  if (isLoading) {
    return (
      <div className="space-y-2" aria-busy="true" aria-label="Chargement de la suggestion">
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
      </div>
    )
  }

  if (suggestion) {
    return (
      <div className="rounded-xl bg-amber-50 p-4">
        <p className="mb-2 text-xs font-semibold text-amber-700">Suggestion personnalisée</p>
        <p className="text-sm leading-relaxed text-zinc-700">{suggestion}</p>
      </div>
    )
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
      <button
        onClick={() => askSuggestion(activity, ageInMonths)}
        className="rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-500"
      >
        Obtenir une suggestion personnalisée
      </button>
    </div>
  )
}
