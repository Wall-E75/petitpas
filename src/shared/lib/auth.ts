import { createClient } from '@/shared/lib/supabase'

// getSession() suffit côté navigateur : on cherche seulement à savoir quelles
// données afficher, la sécurité réelle est assurée par les policies RLS.
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user.id ?? null
}
