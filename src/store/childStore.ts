import { create } from 'zustand'
import type { ChildProfile } from '@/features/enfant/types'

// On définit l'interface du store en regroupant état et actions.
// Les actions sont des fonctions — les inclure dans le même type
// est la convention Zustand pour les stores simples.
interface ChildStore {
  child: ChildProfile | null
  setChild: (child: ChildProfile) => void
  clearChild: () => void
}

export const useChildStore = create<ChildStore>((set) => ({
  child: null,

  setChild: (child) => set({ child }),
  // set() fait un merge shallow : seule la clé `child` est remplacée.
  // Équivalent à : set((state) => ({ ...state, child }))

  clearChild: () => set({ child: null }),
  // Appelé à la déconnexion ou au changement d'enfant sélectionné
}))
