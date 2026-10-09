import { createServerSupabaseClient } from '@/shared/lib/supabaseServer'

// Séparé d'authService.ts car il importe `next/headers`, qui n'existe que
// côté serveur : un composant client qui importerait ce fichier casserait le
// build.

export async function exchangeCodeForSession(code: string): Promise<void> {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) throw new Error(error.message)
}
