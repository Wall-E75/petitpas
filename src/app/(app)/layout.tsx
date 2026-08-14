import Link from 'next/link'
import BottomTabBar from '@/shared/components/BottomTabBar'

// Server Component (défaut Next.js) — pas de 'use client'.
// Ce layout s'applique à toutes les pages du groupe de routes (app).
// Les groupes de routes (parenthèses) organisent sans affecter les URLs :
// app/(app)/page.tsx → route "/"
// app/(app)/profil/page.tsx → route "/profil"
//
// BottomTabBar est un Client Component (usePathname), mais l'imbriquer ici
// ne force pas AppLayout à devenir client : seule la frontière déclarée par
// 'use client' dans BottomTabBar.tsx bascule côté client.

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="flex items-center justify-between border-b bg-white px-4 py-3">
        <span className="font-semibold tracking-tight text-zinc-900">PetitsPas</span>
        <nav className="hidden gap-4 text-sm font-medium text-zinc-600 md:flex">
          <Link href="/" className="hover:text-zinc-900">Activités</Link>
          <Link href="/favoris" className="hover:text-zinc-900">Favoris</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-8">{children}</main>
      <BottomTabBar />
    </div>
  )
}
