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
        <p role="alert" className="mb-6 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          La connexion avec Google a échoué. Veuillez réessayer.
        </p>
      )}
      <LoginForm />
      <AuthDivider />
      <GoogleAuthButton label="Continuer avec Google" />
      <p className="mt-6 text-center text-sm text-fg-muted">
        Pas encore de compte ?{' '}
        <Link href="/register" className="font-medium text-link hover:text-link-hover">
          Créer un compte
        </Link>
      </p>
    </>
  )
}
