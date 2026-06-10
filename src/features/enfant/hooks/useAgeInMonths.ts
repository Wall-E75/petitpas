import { useMemo } from 'react'
import type { AgeInMonths } from '@/features/enfant/types'

export function useAgeInMonths(birthDate: Date): AgeInMonths {
  return useMemo(() => {
    const today = new Date()
    const months =
      (today.getFullYear() - birthDate.getFullYear()) * 12 +
      (today.getMonth() - birthDate.getMonth())
    return Math.max(0, months)
  }, [birthDate.getTime()])
  // .getTime() retourne un number (timestamp) — comparé par valeur, pas par référence.
  // Sans ça, un nouveau Date() avec la même valeur recalculerait inutilement à chaque render.
}
