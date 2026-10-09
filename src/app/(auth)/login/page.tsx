import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/features/auth/components/LoginForm'
import GoogleAuthButton from '@/features/auth/components/GoogleAuthButton'
import AuthDivider from '@/features/auth/components/AuthDivider'

export const metadata: Metadata = {
  title: 'Connexion — PetitsPas',
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>
}

// Server Component : la page ne fait que composer l'UI. Toute l'interactivité
// vit dans <LoginForm /> et <GoogleAuthButton />, seuls fragments 'use client'.
export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Posé par /auth/callback quand le retour de Google échoue ou est annulé.
  const { error } = await searchParams

  return (
    <>
      {error === 'oauth' && (
        <p role="alert" className="mb-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          La connexion avec Google a échoué. Veuillez réessayer.
        </p>
      )}
      <LoginForm />
      <AuthDivider />
      <GoogleAuthButton label="Continuer avec Google" />
      <p className="mt-6 text-center text-sm text-zinc-500">
        Pas encore de compte ?{' '}
        <Link href="/register" className="font-medium text-amber-600 hover:text-amber-700">
          Créer un compte
        </Link>
      </p>
    </>
  )
}
