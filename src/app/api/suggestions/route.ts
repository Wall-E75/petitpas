import { NextRequest, NextResponse } from 'next/server'
import { getActivitySuggestion } from '@/features/ia/services/iaService'
import type { Activity } from '@/features/activites/types'
import type { AgeInMonths } from '@/features/enfant/types'

export async function POST(request: NextRequest) {
  try {
    const { activity, ageInMonths } = (await request.json()) as {
      activity: Activity
      ageInMonths: AgeInMonths
    }

    const suggestion = await getActivitySuggestion(activity, ageInMonths)
    return NextResponse.json({ suggestion })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur inattendue' },
      { status: 500 }
    )
  }
}
