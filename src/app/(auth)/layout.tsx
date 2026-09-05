// Server Component (défaut Next.js) — aucun hook, aucun state ici.
// Ce layout couvre le groupe de routes (auth) : /login et /register.
// Les parenthèses n'apparaissent pas dans l'URL, elles servent juste à
// donner à ces pages un cadre différent de (app) : pas de header, pas de
// BottomTabBar, juste une carte centrée.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center text-lg font-semibold tracking-tight text-zinc-900">
          PetitsPas
        </p>
        {children}
      </div>
    </div>
  )
}
