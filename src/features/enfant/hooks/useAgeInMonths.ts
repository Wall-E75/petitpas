import { useMemo } from 'react'
import type { AgeInMonths } from '@/features/enfant/types'

export function useAgeInMonths(birthDate: Date): AgeInMonths {
  // On dépend du timestamp (un number, comparé par valeur) plutôt que de l'objet
  // Date : un nouveau Date() de même valeur ne doit pas relancer le calcul.
  const birthTime = birthDate.getTime()

  return useMemo(() => {
    const birth = new Date(birthTime)
    const today = new Date()
    const months =
      (today.getFullYear() - birth.getFullYear()) * 12 +
      (today.getMonth() - birth.getMonth())
    return Math.max(0, months)
  }, [birthTime])
}
