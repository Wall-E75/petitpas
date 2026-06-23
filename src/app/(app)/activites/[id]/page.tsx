import { getActivityById } from '@/features/activites/services/activitiesService'
import ActivityDetailClient from '@/features/activites/components/ActivityDetailClient'

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const activity = await getActivityById(id)

  return <ActivityDetailClient activity={activity} />
}
