// Server Component — toute la logique conditionnelle (onboarding vs activités)
// est déléguée à HomePageClient qui peut lire le store Zustand.
// Cette page pourra plus tard exporter des métadonnées SEO sans aucune modification.

import HomePageClient from '@/features/enfant/components/HomePageClient'
import { getCurrentUserId } from '@/features/auth/services/authServerService'

// La session est lue ici, côté serveur, plutôt que dans HomePageClient :
// le premier rendu connaît déjà le bon état, sans flash de chargement.
export default async function HomePage() {
  const userId = await getCurrentUserId()

  return <HomePageClient isAuthenticated={userId !== null} />
}
