// Server Component — toute la logique conditionnelle (onboarding vs activités)
// est déléguée à HomePageClient qui peut lire le store Zustand.
// Cette page pourra plus tard exporter des métadonnées SEO sans aucune modification.

import HomePageClient from '@/features/enfant/components/HomePageClient'

export default function HomePage() {
  return <HomePageClient />
}
