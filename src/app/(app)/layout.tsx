// Server Component (défaut Next.js) — pas de 'use client'.
// Ce layout s'applique à toutes les pages du groupe de routes (app).
// Les groupes de routes (parenthèses) organisent sans affecter les URLs :
// app/(app)/page.tsx → route "/"
// app/(app)/profil/page.tsx → route "/profil"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b bg-white px-4 py-3">
        <span className="font-semibold tracking-tight text-zinc-900">PetitsPas</span>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
