import { useState } from 'react'
import type { Activity } from '@/features/activites/types'
import type { AgeInMonths } from '@/features/enfant/types'

interface UseSuggestionResult {
  suggestion: string | null
  isLoading: boolean
  error: string | null
  askSuggestion: (activity: Activity, ageInMonths: AgeInMonths) => Promise<void>
}

export function useSuggestion(): UseSuggestionResult {
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function askSuggestion(activity: Activity, ageInMonths: AgeInMonths) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity, ageInMonths }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Erreur du serveur')
      }

      setSuggestion(data.suggestion)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setIsLoading(false)
    }
  }

  return { suggestion, isLoading, error, askSuggestion }
}
