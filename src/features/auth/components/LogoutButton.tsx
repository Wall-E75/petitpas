'use client'

import { useLogout } from '@/features/auth/hooks/useLogout'

// 'use client' obligatoire : useLogout utilise useRouter, useState et les
// stores Zustand, et le bouton réagit à onClick.
export default function LogoutButton() {
  const { logout, isLoading, error } = useLogout()

  return (
    <div className="flex items-center gap-2">
      {error && (
        <span role="alert" className="text-xs text-danger">
          {error}
        </span>
      )}
      <button
        type="button"
        onClick={logout}
        disabled={isLoading}
        className="text-sm font-medium text-fg-secondary hover:text-fg disabled:opacity-50"
      >
        {isLoading ? 'Déconnexion…' : 'Se déconnecter'}
      </button>
    </div>
  )
}
