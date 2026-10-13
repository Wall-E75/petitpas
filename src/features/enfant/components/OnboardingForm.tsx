'use client'

import { useState } from 'react'
import { saveChild } from '@/features/enfant/services/childService'
import { useChildStore } from '@/store/childStore'
import type { ChildFormData } from '@/features/enfant/types'

export default function OnboardingForm() {
  const [form, setForm] = useState<ChildFormData>({ name: '', birthDate: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sélecteur : on ne souscrit qu'à l'action, pas à tout le store.
  // Ce composant ne re-rendera pas si child change ailleurs — seul setChild nous intéresse ici.
  const setChild = useChildStore((state) => state.setChild)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // [e.target.name] est une computed property key — la clé est dynamique.
    // Elle doit correspondre exactement aux clés de ChildFormData : "name" et "birthDate".
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // Empêche le rechargement de page natif du formulaire HTML
    setIsLoading(true)
    setError(null)
    try {
      const child = await saveChild(form)
      setChild(child) // Met à jour le store → HomePageClient bascule vers les activités
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setIsLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  // Utilisé comme attribut max du champ date pour bloquer les dates futures.

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-fg">Bienvenue sur PetitsPas</h1>
          <p className="mt-2 text-sm text-fg-muted">
            Commençons par le profil de votre enfant
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-fg-secondary">
              Prénom de l&apos;enfant
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Emma"
              className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg outline-none placeholder:text-fg-muted transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="birthDate" className="text-sm font-medium text-fg-secondary">
              Date de naissance
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
              required
              max={today}
              className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg outline-none placeholder:text-fg-muted transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-500 disabled:opacity-50"
          >
            {isLoading ? 'Enregistrement…' : 'Continuer'}
          </button>
        </form>
      </div>
    </div>
  )
}
