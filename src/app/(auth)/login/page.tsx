import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/features/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'Connexion — PetitsPas',
}

// Server Component : la page ne fait que composer l'UI. Toute l'interactivité
// vit dans <LoginForm />, qui est le seul fragment marqué 'use client'.
export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-zinc-500">
        Pas encore de compte ?{' '}
        <Link href="/register" className="font-medium text-amber-600 hover:text-amber-700">
          Créer un compte
        </Link>
      </p>
    </>
  )
}
