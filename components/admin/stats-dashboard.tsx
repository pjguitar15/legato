'use client'

import { useEffect, useState } from 'react'
import {
  Package,
  Calendar,
  MessageSquare,
  ImageIcon,
  HelpCircle,
  Wrench,
} from 'lucide-react'

interface StatsData {
  packages: number
  events: number
  testimonials: number
  gallery: number
  faqs: number
  equipment: number
}

export default function StatsDashboard() {
  const [stats, setStats] = useState<StatsData>({
    packages: 0,
    events: 0,
    testimonials: 0,
    gallery: 0,
    faqs: 0,
    equipment: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoints = [
          '/api/admin/packages',
          '/api/admin/events',
          '/api/admin/testimonials',
          '/api/admin/gallery',
          '/api/admin/faq',
          '/api/admin/equipment',
        ]

        const responses = await Promise.all(
          endpoints.map((endpoint) => fetch(endpoint)),
        )

        const data = await Promise.all(
          responses.map((response) => response.json()),
        )

        setStats({
          packages: data[0].data?.length || 0,
          events: data[1].data?.length || 0,
          testimonials: data[2].data?.length || 0,
          gallery: data[3].data?.length || 0,
          faqs: data[4].data?.length || 0,
          equipment: data[5].data?.length || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statItems = [
    {
      label: 'Packages',
      value: stats.packages,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      label: 'Events',
      value: stats.events,
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      label: 'Testimonials',
      value: stats.testimonials,
      icon: MessageSquare,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      label: 'Gallery Items',
      value: stats.gallery,
      icon: ImageIcon,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      label: 'FAQs',
      value: stats.faqs,
      icon: HelpCircle,
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      label: 'Equipment Categories',
      value: stats.equipment,
      icon: Wrench,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100 dark:bg-emerald-900/20',
    },
  ]

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className='bg-card rounded-lg p-6 border animate-pulse'
          >
            <div className='flex items-center space-x-4'>
              <div className='w-12 h-12 bg-muted rounded-lg'></div>
              <div className='flex-1'>
                <div className='h-4 bg-muted rounded w-20 mb-2'></div>
                <div className='h-8 bg-muted rounded w-12'></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {statItems.map((item, index) => {
        const Icon = item.icon
        return (
          <div
            key={index}
            className='bg-card rounded-lg p-6 border hover:shadow-md transition-shadow'
          >
            <div className='flex items-center space-x-4'>
              <div
                className={`w-12 h-12 ${item.bg} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  {item.label}
                </p>
                <p className='text-2xl font-bold'>{item.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
