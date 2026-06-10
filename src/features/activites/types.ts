// =============================================================================
// features/activites/types.ts
// =============================================================================

import type { AgeInMonths } from '@/features/enfant/types'

// `import type` indique que cet import n'existe qu'au niveau des types TypeScript,
// jamais comme valeur au runtime. Le bundler peut l'éliminer complètement.

// -----------------------------------------------------------------------------
// DevelopmentArea
//
// Union type plutôt qu'une enum : pas d'objet JS généré au runtime, et les
// valeurs correspondent directement aux colonnes de la DB Supabase.
// -----------------------------------------------------------------------------
export type DevelopmentArea =
  | 'motricite_fine'
  | 'motricite_globale'
  | 'langage'
  | 'eveil_sensoriel'
  | 'social_emotionnel'
  | 'creativite'

// -----------------------------------------------------------------------------
// DifficultyLevel
//
// Principe DRY (Don't Repeat Yourself) : on extrait ce type dans une
// déclaration nommée plutôt que de répéter l'union inline dans Activity
// et ActivityFilters.
//
// Avantages :
// - Modifier les niveaux (ex: ajouter 'expert') → un seul endroit à changer
// - Exportable : d'autres features (ia/, shared/) peuvent importer ce type
// - Lisibilité : `difficulty: DifficultyLevel` dit clairement ce que c'est
// -----------------------------------------------------------------------------
export type DifficultyLevel = 'facile' | 'moyen' | 'avance'

// -----------------------------------------------------------------------------
// Activity
//
// Entité principale de la feature. Représente une activité telle qu'elle
// est stockée en base de données et manipulée dans la logique métier.
//
// Types notables :
// - `materials: string[]`          → tableau de strings (syntaxe courte de Array<string>)
// - `benefits: DevelopmentArea[]`  → TypeScript vérifie que chaque élément est
//                                    une des 6 valeurs autorisées par le type union
// - `imageUrl?: string`            → `?` = champ optionnel (string | undefined).
//                                    TypeScript force une vérification avant usage.
// -----------------------------------------------------------------------------
export interface Activity {
  id: string
  title: string
  description: string
  ageMin: number
  ageMax: number
  duration: number            // En minutes
  materials: string[]
  benefits: DevelopmentArea[]
  difficulty: DifficultyLevel // ← type nommé, pas une union inline
  imageUrl?: string
  isPremium: boolean
  createdAt: Date
}

// -----------------------------------------------------------------------------
// ActivityFilters
//
// Critères de filtrage appliqués par l'utilisateur.
// `ageInMonths` est le seul champ obligatoire : c'est le cœur du filtrage.
// Les autres sont optionnels (`?`) car l'utilisateur peut filtrer sur l'âge seul.
// -----------------------------------------------------------------------------
export interface ActivityFilters {
  ageInMonths: AgeInMonths
  difficulty?: DifficultyLevel // ← même type, même source de vérité
  showPremiumOnly?: boolean
}
