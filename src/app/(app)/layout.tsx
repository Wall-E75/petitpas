import Link from 'next/link'
import BottomTabBar from '@/shared/components/BottomTabBar'
import PageTransition from '@/shared/components/PageTransition'
import LogoutButton from '@/features/auth/components/LogoutButton'

// Server Component (défaut Next.js) — pas de 'use client'.
// Ce layout s'applique à toutes les pages du groupe de routes (app).
// Les groupes de routes (parenthèses) organisent sans affecter les URLs :
// app/(app)/page.tsx → route "/"
// app/(app)/profil/page.tsx → route "/profil"
//
// BottomTabBar et PageTransition sont des Client Components (usePathname),
// mais les imbriquer ici ne force pas AppLayout à devenir client : seule la
// frontière déclarée par 'use client' dans ces fichiers bascule côté client.

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
        <span className="font-semibold tracking-tight text-fg">PetitsPas</span>
        <div className="flex items-center gap-4">
          <nav className="hidden gap-4 text-sm font-medium text-fg-secondary md:flex">
            <Link href="/" className="hover:text-fg">Activités</Link>
            <Link href="/favoris" className="hover:text-fg">Favoris</Link>
          </nav>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-8">
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomTabBar />
    </div>
  )
}
