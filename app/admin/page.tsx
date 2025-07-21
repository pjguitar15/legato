'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Calendar,
  Package,
  Image,
  MessageSquare,
  HelpCircle,
  Wrench,
  Building2,
  InfoIcon,
  Database,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import AuthGuard from '@/components/admin/auth-guard'

const adminSections = [
  {
    title: 'About Us',
    description: 'Manage company information, story, team members, and values',
    icon: InfoIcon,
    href: '/admin/about',
    color: 'bg-blue-500',
  },
  {
    title: 'Company Info',
    description: 'Edit contact details, business hours, and service areas',
    icon: Building2,
    href: '/admin/company',
    color: 'bg-green-500',
  },
  {
    title: 'Packages',
    description: 'Create and manage service packages and pricing',
    icon: Package,
    href: '/admin/packages',
    color: 'bg-purple-500',
  },
  {
    title: 'Equipment',
    description: 'Manage equipment categories and individual items',
    icon: Wrench,
    href: '/admin/equipment',
    color: 'bg-orange-500',
  },
  {
    title: 'Events',
    description: 'Add recent events and showcase your work',
    icon: Calendar,
    href: '/admin/events',
    color: 'bg-red-500',
  },
  {
    title: 'Gallery',
    description: 'Upload and organize event photos',
    icon: Image,
    href: '/admin/gallery',
    color: 'bg-indigo-500',
  },
  {
    title: 'Testimonials',
    description: 'Manage client reviews and feedback',
    icon: Users,
    href: '/admin/testimonials',
    color: 'bg-pink-500',
  },
  {
    title: 'FAQ',
    description: 'Manage frequently asked questions',
    icon: HelpCircle,
    href: '/admin/faq',
    color: 'bg-teal-500',
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isInitializing, setIsInitializing] = useState(false)

  const handleInitializeData = async () => {
    console.log('🔄 Initialize Data button clicked')
    setIsInitializing(true)

    try {
      const apiUrl = '/api/admin/init-data'
      console.log('📡 Making API request to:', apiUrl)
      console.log('🌐 Current location:', window.location.href)
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('📨 Response status:', response.status)
      console.log('📨 Response ok:', response.ok)

      const data = await response.json()
      console.log('📋 Response data:', data)

      if (data.success) {
        console.log('✅ Success:', data.message)
        toast({
          title: 'Success!',
          description: data.message,
          duration: 5000,
        })
      } else {
        console.error('❌ API Error:', data.error)
        toast({
          title: 'Error',
          description: data.error || 'Failed to initialize data',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('❌ Network/Request Error:', error)
      toast({
        title: 'Error',
        description: `Network error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        variant: 'destructive',
      })
    } finally {
      setIsInitializing(false)
      console.log('✋ Initialize process completed')
    }
  }

  return (
    <AuthGuard>
      <div className='space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-4xl font-bold mb-4'>Admin Dashboard</h1>
          <p className='text-muted-foreground text-lg'>
            Manage your website content and settings
          </p>
        </div>

        {/* Initialize Data Section */}
        <div className='bg-card rounded-xl border p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Database className='w-8 h-8 text-blue-500' />
              <div>
                <h3 className='text-lg font-semibold'>
                  Initialize Sample Data
                </h3>
                <p className='text-muted-foreground text-sm'>
                  Load original About Us content and sample data into the
                  database
                </p>
              </div>
            </div>
            <Button
              onClick={handleInitializeData}
              disabled={isInitializing}
              className='bg-blue-500 hover:bg-blue-600'
            >
              {isInitializing ? (
                <>
                  <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2' />
                  Initializing...
                </>
              ) : (
                <>
                  <Database className='w-4 h-4 mr-2' />
                  Initialize Data
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Admin Sections Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {adminSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className='group block'
            >
              <div className='bg-card rounded-xl border p-6 hover:shadow-lg transition-all duration-300 group-hover:scale-105'>
                <div className='flex items-center space-x-3 mb-3'>
                  <div className={`${section.color} p-2 rounded-lg`}>
                    <section.icon className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='font-semibold text-lg group-hover:text-primary transition-colors'>
                    {section.title}
                  </h3>
                </div>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className='bg-card rounded-xl border p-6'>
          <h3 className='text-lg font-semibold mb-4'>Quick Actions</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Button
              variant='outline'
              className='justify-start h-auto p-4'
              onClick={() => router.push('/admin/about')}
            >
              <InfoIcon className='w-5 h-5 mr-3' />
              <div className='text-left'>
                <div className='font-medium'>Edit About Us</div>
                <div className='text-sm text-muted-foreground'>
                  Update company story
                </div>
              </div>
            </Button>

            <Button
              variant='outline'
              className='justify-start h-auto p-4'
              onClick={() => router.push('/admin/packages')}
            >
              <Package className='w-5 h-5 mr-3' />
              <div className='text-left'>
                <div className='font-medium'>Manage Packages</div>
                <div className='text-sm text-muted-foreground'>
                  Add new services
                </div>
              </div>
            </Button>

            <Button
              variant='outline'
              className='justify-start h-auto p-4'
              onClick={() => router.push('/admin/gallery')}
            >
              <Image className='w-5 h-5 mr-3' />
              <div className='text-left'>
                <div className='font-medium'>Upload Photos</div>
                <div className='text-sm text-muted-foreground'>
                  Add event gallery
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
