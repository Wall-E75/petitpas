'use client'

import { useState } from 'react'
import { useRegister } from '@/features/auth/hooks/useRegister'
import type { RegisterFormData } from '@/features/auth/types'

const initialForm: RegisterFormData = { email: '', password: '', confirmPassword: '' }

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterFormData>(initialForm)
  const [validationError, setValidationError] = useState<string | null>(null)
  const { register, isLoading, error } = useRegister()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidationError(null)

    // Validation côté client avant de solliciter Supabase : on ne fait
    // remonter au service que des données déjà cohérentes.
    if (form.password !== form.confirmPassword) {
      setValidationError('Les deux mots de passe ne correspondent pas.')
      return
    }

    // On ne transmet que ce que le service attend (AuthCredentials) —
    // confirmPassword ne sort pas du composant.
    await register({ email: form.email, password: form.password })
  }

  const displayedError = validationError ?? error

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Créer un compte</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Pour retrouver vos activités favorites
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="vous@exemple.fr"
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-700">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      {displayedError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{displayedError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-500 disabled:opacity-50"
      >
        {isLoading ? 'Création…' : "S'inscrire"}
      </button>
    </form>
  )
}
