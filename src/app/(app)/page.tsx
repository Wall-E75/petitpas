// Server Component — pas de 'use client'.
//
// Pourquoi Server et pas Client ?
// Cette page n'a aucune interactivité propre. Elle pourra plus tard :
// - exporter des métadonnées SEO (export const metadata)
// - faire des appels DB directs avec async/await
// L'interactivité (useActivities, useState) est isolée dans ActivitiesView.
//
// Pourquoi on ne peut pas lire le store Zustand ici ?
// Zustand tourne côté navigateur. Les Server Components s'exécutent côté serveur,
// où il n'y a pas de state React entre deux requêtes. Pour accéder à l'âge
// de l'enfant depuis le store, il faudra un Client Component wrapper.
// Pour l'instant, l'âge est hardcodé en attendant l'implémentation de l'onboarding.

import ActivitiesView from '@/features/activites/components/ActivitiesView'

const HARDCODED_AGE = 17 // TODO : remplacer par le profil enfant depuis le store

export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">
          Activités pour ton enfant
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{HARDCODED_AGE} mois</p>
      </div>
      <ActivitiesView ageInMonths={HARDCODED_AGE} />
    </div>
  )
}
