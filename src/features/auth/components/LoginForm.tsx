'use client'

import { useState } from 'react'
import { useLogin } from '@/features/auth/hooks/useLogin'
import type { AuthCredentials } from '@/features/auth/types'

// 'use client' obligatoire : useState, useLogin (useRouter + useState) et
// l'événement onSubmit ne peuvent tourner que côté client.
export default function LoginForm() {
  const [form, setForm] = useState<AuthCredentials>({ email: '', password: '' })
  const { login, isLoading, error } = useLogin()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await login(form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Connexion</h1>
        <p className="mt-2 text-sm text-zinc-500">Content de vous revoir</p>
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
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          required
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-500 disabled:opacity-50"
      >
        {isLoading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  )
}
