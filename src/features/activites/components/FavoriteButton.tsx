'use client'

import { useFavorites } from '@/features/favoris/hooks/useFavorites'

interface Props {
  activityId: string
}

export default function FavoriteButton({ activityId }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(activityId)

  return (
    <button
      type="button"
      onClick={e => {
        // preventDefault/stopPropagation : ActivityCard enveloppe toute la
        // carte dans un <Link> vers la page de détail. Sans ça, cliquer sur
        // le cœur déclencherait aussi la navigation.
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(activityId)
      }}
      aria-pressed={active}
      aria-label={active ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-sm transition-transform active:scale-90"
    >
      <HeartIcon filled={active} />
    </button>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-6.716-4.35-9.428-8.28C.86 9.94 1.6 6.5 4.5 5.1 6.6 4.08 9 4.8 12 7.5c3-2.7 5.4-3.42 7.5-2.4 2.9 1.4 3.64 4.84 1.928 7.62C18.716 16.65 12 21 12 21z"
      />
    </svg>
  )
}
