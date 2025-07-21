'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface ClientGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ClientGuard({ children, fallback }: ClientGuardProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      fallback || (
        <div className='flex items-center justify-center p-8'>
          <div className='flex flex-col items-center space-y-3'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
            <p className='text-sm text-muted-foreground'>Loading...</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
