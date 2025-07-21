'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Music, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('adminToken', data.token)

        // Redirect to admin dashboard
        router.push('/admin')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        {/* Logo and Title */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mb-4'>
            <Music className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-3xl font-display font-bold mb-2'>Admin Login</h1>
          <p className='text-muted-foreground'>Access the Legato admin panel</p>
        </div>

        {/* Login Form */}
        <div className='bg-card rounded-2xl border border-border p-8 shadow-xl'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Username Field */}
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium mb-2'
              >
                Username
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                <input
                  id='username'
                  type='text'
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  className='w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  placeholder='Enter username'
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium mb-2'
              >
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                <input
                  id='password'
                  type='password'
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className='w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  placeholder='Enter password'
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-3'>
                <p className='text-destructive text-sm'>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className='mt-6 pt-6 border-t border-border'>
            <p className='text-sm text-muted-foreground text-center'>
              Demo Credentials: <strong>admin</strong> / <strong>admin</strong>
            </p>
          </div>
        </div>

        {/* Back to Site */}
        <div className='text-center mt-6'>
          <a
            href='/'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  )
}
