import type { Metadata } from 'next'
import { getActivityById } from '@/features/activites/services/activitiesService'
import ActivityDetailClient from '@/features/activites/components/ActivityDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

// generateMetadata est l'équivalent dynamique de l'export `metadata` statique :
// il peut aller chercher des données (ici en DB) avant de construire les
// balises <head>. Next.js n'autorise pas les deux exports sur le même segment.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const activity = await getActivityById(id)

  return {
    title: activity.title,
    description: activity.description,
    openGraph: {
      title: activity.title,
      description: activity.description,
      type: 'article',
      images: activity.imageUrl ? [{ url: activity.imageUrl }] : undefined,
    },
  }
}

export default async function ActivityPage({ params }: Props) {
  const { id } = await params
  const activity = await getActivityById(id)

  return <ActivityDetailClient activity={activity} />
}
