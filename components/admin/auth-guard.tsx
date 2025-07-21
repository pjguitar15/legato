'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔐 Checking authentication...')
        // Check if user is authenticated by calling our auth verification endpoint
        const response = await fetch('/api/auth/verify', {
          credentials: 'include', // Include cookies
        })

        console.log('🔐 Auth response status:', response.status)

        if (response.ok) {
          const data = await response.json()
          console.log('🔐 Auth response data:', data)
          if (data.success && data.user) {
            console.log('✅ Authentication successful')
            setIsAuthenticated(true)
          } else {
            console.log('❌ Authentication failed - no user data')
            // Clear any invalid tokens
            logout()
            router.push('/login')
          }
        } else {
          console.log('❌ Authentication failed - response not ok')
          // Clear any invalid tokens
          logout()
          router.push('/login')
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error)
        logout()
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
