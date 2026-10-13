import type { Metadata } from 'next'
import Link from 'next/link'

// Ce fichier est un Server Component par défaut (pas de 'use client') :
// aucun state, aucun hook, aucun événement — juste du HTML statique. Next.js
// peut donc le rendre entièrement côté serveur, ce qui est le comportement
// par défaut recherché dans ce projet (voir CLAUDE.md, section React/Next.js).

// `metadata` ici écrase le title/description hérités du RootLayout pour cette
// page précise. Next.js ajoute déjà automatiquement <meta name="robots"
// content="noindex" /> sur les réponses 404, donc pas besoin de le préciser.
export const metadata: Metadata = {
  title: 'Page introuvable',
  description: "La page que vous cherchez n'existe pas ou plus.",
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
      <p className="text-6xl font-bold text-amber-600 dark:text-amber-400">404</p>
      <h1 className="text-xl font-semibold text-fg">Page introuvable</h1>
      <p className="max-w-xs text-sm text-fg-muted">
        La page que vous cherchez n&apos;existe pas ou plus.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-500"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
