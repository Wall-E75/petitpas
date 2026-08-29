'use client'

// Ce composant est la frontière entre page.tsx (Server) et le store Zustand (Client).
// Le serveur ne peut pas savoir si un enfant est configuré — cette décision
// appartient au navigateur, où Zustand vit.

import { AnimatePresence, motion } from 'framer-motion'
import { useChildStore } from '@/store/childStore'
import { useAgeInMonths } from '@/features/enfant/hooks/useAgeInMonths'
import OnboardingForm from '@/features/enfant/components/OnboardingForm'
import ActivitiesView from '@/features/activites/components/ActivitiesView'

export default function HomePageClient() {
  const child = useChildStore((state) => state.child)

  // AnimatePresence anime aussi les sorties : sans lui, OnboardingForm
  // disparaîtrait du DOM instantanément dès que `child` devient non-null,
  // car React ne laisse pas le temps à une animation de s'exécuter avant
  // de démonter un élément. mode="wait" évite que les deux vues se chevauchent.
  return (
    <AnimatePresence mode="wait">
      {!child ? (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <OnboardingForm />
        </motion.div>
      ) : (
        // On délègue à un sous-composant pour respecter la règle des hooks :
        // useAgeInMonths ne peut pas être appelé après un return conditionnel.
        // Un hook doit être appelé au même niveau à chaque render — jamais conditionnellement.
        <motion.div
          key="activities"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ActivitiesWithAge birthDate={child.birthDate} name={child.name} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Sous-composant interne — pas exporté, utilisé uniquement par HomePageClient.
// Il appelle useAgeInMonths inconditionnellement, ce qui respecte les règles des hooks.
function ActivitiesWithAge({ birthDate, name }: { birthDate: Date; name: string }) {
  const ageInMonths = useAgeInMonths(birthDate)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">
          Activités pour {name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{ageInMonths} mois</p>
      </div>
      <ActivitiesView ageInMonths={ageInMonths} />
    </div>
  )
}
