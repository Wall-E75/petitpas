import Link from 'next/link'

// Server Component (défaut Next.js) — pas de 'use client'.
// Ce layout s'applique à toutes les pages du groupe de routes (app).
// Les groupes de routes (parenthèses) organisent sans affecter les URLs :
// app/(app)/page.tsx → route "/"
// app/(app)/profil/page.tsx → route "/profil"
//
// Link reste utilisable ici sans 'use client' : c'est un composant fourni
// par Next.js, pas un hook — il ne force pas ce layout à devenir client.

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold tracking-tight text-zinc-900">PetitsPas</span>
          <nav className="flex gap-4 text-sm font-medium text-zinc-600">
            <Link href="/" className="hover:text-zinc-900">Activités</Link>
            <Link href="/favoris" className="hover:text-zinc-900">Favoris</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
