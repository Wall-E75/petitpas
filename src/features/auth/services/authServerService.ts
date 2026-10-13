import { cache } from 'react'
import { createServerSupabaseClient } from '@/shared/lib/supabaseServer'

// Séparé d'authService.ts car il importe `next/headers`, qui n'existe que
// côté serveur : un composant client qui importerait ce fichier casserait le
// build.

// cache() : le layout et la page appellent tous deux cette fonction pendant
// le même rendu ; sans lui, chaque appel interrogerait le serveur Auth.
// getUser() plutôt que getSession() : le résultat décide de ce qu'on affiche,
// il doit venir d'un token validé et non d'un cookie relu tel quel.
export const getCurrentUserId = cache(async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  return user?.id ?? null
})

export async function exchangeCodeForSession(code: string): Promise<void> {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) throw new Error(error.message)
}
