// Client-side auth utilities only
export interface AuthUser {
  username: string
  role: string
  iat: number
  exp: number
}

export function logout() {
  // Clear the auth cookie with all possible variations
  document.cookie =
    'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  document.cookie =
    'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' +
    window.location.hostname
  document.cookie =
    'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure'
  document.cookie =
    'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=strict'

  // Also clear any localStorage tokens (for backward compatibility)
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken')
  }
}
