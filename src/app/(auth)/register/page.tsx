import type { Metadata } from 'next'
import Link from 'next/link'
import RegisterForm from '@/features/auth/components/RegisterForm'
import GoogleAuthButton from '@/features/auth/components/GoogleAuthButton'
import AuthDivider from '@/features/auth/components/AuthDivider'

export const metadata: Metadata = {
  title: 'Inscription — PetitsPas',
}

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
      <AuthDivider />
      <GoogleAuthButton label="S'inscrire avec Google" />
      <p className="mt-6 text-center text-sm text-fg-muted">
        Déjà un compte ?{' '}
        <Link href="/login" className="font-medium text-link hover:text-link-hover">
          Se connecter
        </Link>
      </p>
    </>
  )
}
