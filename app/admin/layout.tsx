'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Wrench,
  ImageIcon,
  Calendar,
  MessageSquare,
  Users,
  HelpCircle,
  Building,
  Menu,
  X,
  ClipboardList,
  LogOut,
} from 'lucide-react'
import Image from 'next/image'
import whiteLogo from '@/public/Legato Landscape.png'
import blackLogo from '@/public/Legato Landscape Black.png'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import AuthGuard from '@/components/admin/auth-guard'

const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Event Bookings', href: '/admin/event-bookings', icon: Calendar },
  { name: 'Packages', href: '/admin/packages', icon: Package },
  { name: 'Equipment', href: '/admin/equipment', icon: Wrench },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  {
    name: 'Feedback Reviews',
    href: '/admin/feedback-reviews',
    icon: ClipboardList,
  },
  { name: 'About Us', href: '/admin/about', icon: Users },
  { name: 'FAQ', href: '/admin/faq', icon: HelpCircle },
  { name: 'Company Info', href: '/admin/company', icon: Building },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AuthGuard>
      <div className='min-h-screen bg-background'>
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className='fixed inset-0 z-40 lg:hidden'
            onClick={() => setSidebarOpen(false)}
          >
            <div className='fixed inset-0 bg-black/50' />
          </div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className='flex items-center justify-between h-16 px-6 border-b border-border'>
            <div className='flex items-center space-x-3'>
              <Image
                src={theme === 'dark' ? whiteLogo : blackLogo}
                alt='Legato Admin'
                width={120}
                height={40}
                className='h-6 w-auto'
              />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className='lg:hidden p-2 rounded-lg hover:bg-accent transition-colors'
            >
              <X className='w-6 h-6' />
            </button>
          </div>

          <nav className='mt-6 px-3'>
            <ul className='space-y-2'>
              {adminNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[hsl(var(--primary))] text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className='w-5 h-5' />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className='lg:pl-64'>
          {/* Top bar */}
          <div className='sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-background/95 backdrop-blur-sm border-b border-border'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='lg:hidden p-2 rounded-lg hover:bg-accent transition-colors'
            >
              <Menu className='w-6 h-6' />
            </button>
            <h1 className='text-xl font-display font-bold mt-5'>
              Legato Admin
            </h1>
            <div className='flex items-center space-x-4'>
              <Link
                href='/'
                className='px-4 py-2 bg-[hsl(var(--primary))] text-primary-foreground rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors'
              >
                View Site
              </Link>
              <button
                onClick={async () => {
                  try {
                    await fetch('/api/auth/logout', { method: 'POST' })
                    logout()
                    router.push('/login')
                  } catch (error) {
                    console.error('Logout failed:', error)
                    logout()
                    router.push('/login')
                  }
                }}
                className='px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center space-x-2'
              >
                <LogOut className='w-4 h-4' />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Page content */}
          <main className='p-6'>{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
