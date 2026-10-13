import { createClient } from '@/shared/lib/supabase'
import type { AuthCredentials, OAuthProvider } from '@/features/auth/types'

// Même rôle que activitiesService / favoritesService : ce fichier est le seul
// à connaître l'API `supabase.auth`. Les hooks appellent ces fonctions sans
// savoir qu'il y a Supabase derrière — on pourrait changer de provider sans
// toucher aux hooks ni aux composants.

export async function signIn({ email, password }: AuthCredentials): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) throw new Error(translateAuthError(error.message))
}

export async function signUp({ email, password }: AuthCredentials): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) throw new Error(translateAuthError(error.message))
}

// Pas de session en retour : Supabase redirige le navigateur vers le
// provider. La session n'existera qu'au retour, dans /auth/callback.
export async function signInWithOAuth(provider: OAuthProvider): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      // NEXT_PUBLIC_SITE_URL fixe l'URL en production ; sans elle on retombe
      // sur l'origine courante (localhost en dev). Cette URL doit figurer dans
      // les "Redirect URLs" du dashboard Supabase, sinon Supabase la remplace
      // par la Site URL.
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback`,
    },
  })

  if (error) throw new Error(translateAuthError(error.message))
}

export async function signOut(): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) throw new Error(translateAuthError(error.message))
}

// Supabase renvoie ses messages en anglais. On traduit les cas les plus
// fréquents ; le reste passe tel quel plutôt que d'afficher un message
// générique qui masquerait l'info utile.
function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'Email ou mot de passe incorrect.',
    'User already registered': 'Un compte existe déjà avec cet email.',
    'Password should be at least 6 characters':
      'Le mot de passe doit contenir au moins 6 caractères.',
  }

  return map[message] ?? message
}
