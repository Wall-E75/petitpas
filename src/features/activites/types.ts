import type { AgeInMonths } from '@/features/enfant/types'

export type DevelopmentArea =
  | 'motricite_fine'
  | 'motricite_globale'
  | 'langage'
  | 'eveil_sensoriel'
  | 'social_emotionnel'
  | 'creativite'

export type DifficultyLevel = 'facile' | 'moyen' | 'avance'

export interface Activity {
  id: string
  title: string
  description: string
  ageMin: number
  ageMax: number
  duration: number       // En minutes
  materials: string[]
  benefits: DevelopmentArea[]
  difficulty: DifficultyLevel
  imageUrl?: string
  isPremium: boolean
  createdAt: Date
}

export interface ActivityFilters {
  ageInMonths: AgeInMonths  // Seul champ obligatoire — cœur du filtrage par âge
  difficulty?: DifficultyLevel
  showPremiumOnly?: boolean
}
