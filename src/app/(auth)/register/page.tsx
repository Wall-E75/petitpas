import type { Metadata } from 'next'
import Link from 'next/link'
import RegisterForm from '@/features/auth/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Inscription — PetitsPas',
}

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-zinc-500">
        Déjà un compte ?{' '}
        <Link href="/login" className="font-medium text-amber-600 hover:text-amber-700">
          Se connecter
        </Link>
      </p>
    </>
  )
}
