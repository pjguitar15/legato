'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
// Removed dropdown-menu dependency for desktop hover menus to avoid flicker
import {
  Menu,
  X,
  Volume2,
  Zap,
  ChevronDown,
  Layers,
  Film,
  Headphones,
  Info,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
// Theme toggle removed per request
import { useCompanyData } from '@/hooks/use-company-data'
import { useMessenger } from '@/contexts/messenger-context'
import Image from 'next/image'
import whiteLogo from '@/public/Legato Landscape.png'
import blackLogo from '@/public/Legato Landscape Black.png'
import { useTheme } from 'next-themes'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isContentOpen, setIsContentOpen] = useState(false)
  const moreCloseTimeoutRef = useRef<number | null>(null)
  const contentCloseTimeoutRef = useRef<number | null>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { companyData, isLoading } = useCompanyData()
  const { openMessenger } = useMessenger()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Simplified hover open/close handled on wrapper

  // Important links outside dropdown
  const importantLinks = [
    { href: '#home', label: 'Home' },
    { href: '#packages', label: 'Packages' },
    { href: '/contact', label: 'Contact' },
  ]
  // Grouped links in dropdown
  const groupedLinks = [
    {
      href: '#equipment',
      label: 'Equipment',
      icon: <Layers className='w-4 h-4 mr-2' />,
    },
    {
      href: '#gallery',
      label: 'Gallery',
      icon: <Film className='w-4 h-4 mr-2' />,
    },
    {
      href: '#events',
      label: 'Events',
      icon: <Zap className='w-4 h-4 mr-2' />,
    },
    {
      href: '#testimonials',
      label: 'Testimonials',
      icon: <Headphones className='w-4 h-4 mr-2' />,
    },
    { href: '#about', label: 'About', icon: <Info className='w-4 h-4 mr-2' /> },
    {
      href: '#faq',
      label: 'FAQ',
      icon: <HelpCircle className='w-4 h-4 mr-2' />,
    },
  ]
  // Content dropdown
  const contentLinks = [
    { href: '/vlogs', label: 'Vlogs', icon: <Film className='w-4 h-4 mr-2' /> },
  ]

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    // If link is an app route, navigate normally
    if (!href.startsWith('#')) return
    e.preventDefault()
    // If not on homepage, go home then scroll
    if (pathname !== '/') {
      router.push('/' + href)
      setIsMenuOpen(false)
      return
    }
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80
      window.scrollTo({ top: offsetTop, behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const handleMessenger = () => {
    openMessenger()
  }

  if (!mounted) {
    return null
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm shadow-lg border-b border-border'
          : 'bg-background/80 shadow-sm border-b border-border'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center space-x-3'>
            <Link
              href='/'
              aria-label='Go to homepage'
              className='w-32 h-auto flex items-center justify-center cursor-pointer'
            >
              <Image
                src={theme === 'light' ? blackLogo : whiteLogo}
                alt={companyData?.name || 'Legato Sounds and Lights'}
                className='absolute w-32 h-auto transition-opacity duration-300'
                priority
              />
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-2'>
            {importantLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className='text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
            {/* Grouped dropdown (hover) */}
            <div
              className='relative'
              onMouseEnter={() => {
                if (moreCloseTimeoutRef.current)
                  window.clearTimeout(moreCloseTimeoutRef.current)
                setIsMoreOpen(true)
              }}
              onMouseLeave={() => {
                if (moreCloseTimeoutRef.current)
                  window.clearTimeout(moreCloseTimeoutRef.current)
                moreCloseTimeoutRef.current = window.setTimeout(
                  () => setIsMoreOpen(false),
                  150,
                )
              }}
            >
              <button
                onClick={() => setIsMoreOpen((v) => !v)}
                aria-haspopup='menu'
                aria-expanded={isMoreOpen}
                className='flex items-center text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer'
              >
                More <ChevronDown className='w-4 h-4 ml-1' />
              </button>
              {isMoreOpen && (
                <div
                  role='menu'
                  className='absolute right-0 top-full pt-2 w-56 z-50'
                >
                  <div
                    className='rounded-md border border-border bg-white dark:bg-neutral-900 shadow-lg py-2'
                    onMouseEnter={() => {
                      if (moreCloseTimeoutRef.current)
                        window.clearTimeout(moreCloseTimeoutRef.current)
                      setIsMoreOpen(true)
                    }}
                    onMouseLeave={() => {
                      if (moreCloseTimeoutRef.current)
                        window.clearTimeout(moreCloseTimeoutRef.current)
                      moreCloseTimeoutRef.current = window.setTimeout(
                        () => setIsMoreOpen(false),
                        150,
                      )
                    }}
                  >
                    {groupedLinks.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => handleNavClick(e as any, item.href)}
                        className='flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-black/10 dark:hover:bg-white/10'
                        role='menuitem'
                      >
                        {item.icon}
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Content dropdown (hover) */}
            <div
              className='relative'
              onMouseEnter={() => {
                if (contentCloseTimeoutRef.current)
                  window.clearTimeout(contentCloseTimeoutRef.current)
                setIsContentOpen(true)
              }}
              onMouseLeave={() => {
                if (contentCloseTimeoutRef.current)
                  window.clearTimeout(contentCloseTimeoutRef.current)
                contentCloseTimeoutRef.current = window.setTimeout(
                  () => setIsContentOpen(false),
                  150,
                )
              }}
            >
              <button
                onClick={() => setIsContentOpen((v) => !v)}
                aria-haspopup='menu'
                aria-expanded={isContentOpen}
                className='flex items-center text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer'
              >
                Content <ChevronDown className='w-4 h-4 ml-1' />
              </button>
              {isContentOpen && (
                <div
                  role='menu'
                  className='absolute right-0 top-full pt-2 w-56 z-50'
                >
                  <div
                    className='rounded-md border border-border bg-white dark:bg-neutral-900 shadow-lg py-2'
                    onMouseEnter={() => {
                      if (contentCloseTimeoutRef.current)
                        window.clearTimeout(contentCloseTimeoutRef.current)
                      setIsContentOpen(true)
                    }}
                    onMouseLeave={() => {
                      if (contentCloseTimeoutRef.current)
                        window.clearTimeout(contentCloseTimeoutRef.current)
                      contentCloseTimeoutRef.current = window.setTimeout(
                        () => setIsContentOpen(false),
                        150,
                      )
                    }}
                  >
                    {contentLinks.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => {
                          router.push(item.href)
                          setIsMenuOpen(false)
                        }}
                        className='w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors cursor-pointer hover:bg-black/10 dark:hover:bg-white/10'
                        role='menuitem'
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Right side buttons */}
          <div className='flex items-center space-x-4'>
            <Button
              onClick={() => router.push('/packages')}
              className='hidden sm:flex bg-[hsl(var(--primary))] text-primary-foreground hover:bg-[hsl(var(--primary))]/90'
              size='sm'
            >
              Book Now
            </Button>
            {/* Mobile menu button */}
            <div className='md:hidden'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className='h-6 w-6' />
                ) : (
                  <Menu className='h-6 w-6' />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='md:hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background shadow-lg border-b border-border animate-fade-in-up'>
            {importantLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className='text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
            <div className='px-3 py-1 text-xs uppercase text-muted-foreground'>
              More
            </div>
            {groupedLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className='flex items-center gap-2 text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
            <div className='px-3 py-1 text-xs uppercase text-muted-foreground'>
              Content
            </div>
            {contentLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className='flex items-center gap-2 text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
                onClick={() => {
                  router.push(item.href)
                  setIsMenuOpen(false)
                }}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
