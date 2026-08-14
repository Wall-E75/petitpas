'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// usePathname est un hook (utilise du state interne au routeur) : Next.js
// interdit de l'appeler dans un Server Component. 'use client' déclare donc
// cette frontière — c'est le point d'entrée client, comme pour FavoriteButton.

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ filled: boolean }>
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Accueil', icon: HomeIcon },
  { href: '/', label: 'Activités', icon: ActivityIcon },
  { href: '/favoris', label: 'Favoris', icon: StarIcon },
]

export default function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-10 flex border-t bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
              active ? 'text-emerald-600' : 'text-zinc-500'
            }`}
          >
            <item.icon filled={active} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function HomeIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"
      />
    </svg>
  )
}

function ActivityIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <circle cx="12" cy="9" r="6" />
      <path strokeLinecap="round" d="M12 15c-1.3 2.2-1.3 4.5 0 6" />
    </svg>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 16.6l-5.2 2.7 1-5.9-4.3-4.2 5.9-.8L12 3z"
      />
    </svg>
  )
}
