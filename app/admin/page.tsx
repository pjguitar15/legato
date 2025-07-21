'use client'

import { useState } from 'react'
import AuthGuard from '@/components/admin/auth-guard'
import StatsDashboard from '@/components/admin/stats-dashboard'
import { Database, RefreshCw, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [initMessage, setInitMessage] = useState('')
  const router = useRouter()

  const handleInitializeData = async () => {
    setIsInitializing(true)
    setInitMessage('')

    try {
      const response = await fetch('/api/admin/init-data', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setInitMessage(`Data initialized successfully! 
          Packages: ${data.results.packages}, 
          Events: ${data.results.events}, 
          Testimonials: ${data.results.testimonials}, 
          Gallery: ${data.results.gallery}, 
          FAQs: ${data.results.faqs}, 
          Equipment: ${data.results.equipment}`)

        // Refresh the page to update stats
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setInitMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error initializing data:', error)
      setInitMessage('Failed to initialize data')
    } finally {
      setIsInitializing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/login')
  }

  return (
    <AuthGuard>
      <div className='space-y-8'>
        {/* Header */}
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-3xl font-display font-bold mb-2'>
              Admin Dashboard
            </h1>
            <p className='text-muted-foreground'>
              Manage your Legato Sounds and Lights content
            </p>
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center space-x-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors'
          >
            <LogOut className='w-4 h-4' />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Dashboard */}
        <div>
          <h2 className='text-xl font-semibold mb-4'>Overview</h2>
          <StatsDashboard />
        </div>

        {/* Data Management */}
        <div className='bg-card rounded-lg p-6 border'>
          <h2 className='text-xl font-semibold mb-4 flex items-center space-x-2'>
            <Database className='w-5 h-5' />
            <span>Data Management</span>
          </h2>

          <div className='space-y-4'>
            <p className='text-muted-foreground'>
              Initialize the database with data from your JSON files. This will
              replace all existing data.
            </p>

            <button
              onClick={handleInitializeData}
              disabled={isInitializing}
              className='flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50'
            >
              <RefreshCw
                className={`w-4 h-4 ${isInitializing ? 'animate-spin' : ''}`}
              />
              <span>
                {isInitializing ? 'Initializing...' : 'Initialize Database'}
              </span>
            </button>

            {initMessage && (
              <div
                className={`p-4 rounded-lg ${
                  initMessage.includes('Error')
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }`}
              >
                <pre className='whitespace-pre-wrap text-sm'>{initMessage}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <a
            href='/admin/packages'
            className='bg-card rounded-lg p-6 border hover:shadow-md transition-shadow block'
          >
            <h3 className='font-semibold mb-2'>Manage Packages</h3>
            <p className='text-sm text-muted-foreground'>
              Add, edit, and organize service packages
            </p>
          </a>

          <a
            href='/admin/events'
            className='bg-card rounded-lg p-6 border hover:shadow-md transition-shadow block'
          >
            <h3 className='font-semibold mb-2'>Manage Events</h3>
            <p className='text-sm text-muted-foreground'>
              Update past and upcoming events
            </p>
          </a>

          <a
            href='/admin/testimonials'
            className='bg-card rounded-lg p-6 border hover:shadow-md transition-shadow block'
          >
            <h3 className='font-semibold mb-2'>Manage Testimonials</h3>
            <p className='text-sm text-muted-foreground'>
              Review and add customer feedback
            </p>
          </a>
        </div>
      </div>
    </AuthGuard>
  )
}
