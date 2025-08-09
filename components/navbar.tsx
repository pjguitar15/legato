'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Menu, X, Volume2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useCompanyData } from '@/hooks/use-company-data'
import { useMessenger } from '@/contexts/messenger-context'
import Image from 'next/image'
import whiteLogo from '@/public/Legato Landscape.png'
import blackLogo from '@/public/Legato Landscape Black.png'
import { useTheme } from 'next-themes'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
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

  const navGroups = [
    {
      label: 'Explore',
      items: [
        { href: '#home', label: 'Home' },
        { href: '#packages', label: 'Packages' },
        { href: '#equipment', label: 'Equipment' },
        { href: '#gallery', label: 'Gallery' },
        { href: '#events', label: 'Events' },
        { href: '#testimonials', label: 'Testimonials' },
        { href: '#about', label: 'About' },
        { href: '#contact', label: 'Contact' },
      ],
    },
    {
      label: 'Media',
      items: [{ href: '/contents', label: 'Contents' }],
    },
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
          : 'bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center space-x-3'>
            <div className='w-32 h-auto flex items-center justify-center'>
              <Image
                src={theme === 'light' ? blackLogo : whiteLogo}
                alt={companyData?.name || 'Legato Sounds and Lights'}
                className='absolute w-32 h-auto transition-opacity duration-300'
                priority
              />
            </div>
          </div>

          {/* Desktop Navigation - grouped as dropdowns */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-center space-x-3'>
              <DropdownMenu>
                <DropdownMenuTrigger className='text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors'>
                  Explore
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {navGroups[0].items.map((item) => (
                    <DropdownMenuItem
                      key={item.href}
                      onSelect={(e) => {
                        e.preventDefault()
                        handleNavClick(
                          { preventDefault: () => {} } as any,
                          item.href,
                        )
                      }}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger className='text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors'>
                  Media
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => router.push('/contents')}>
                    Contents
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Right side buttons */}
          <div className='flex items-center space-x-4'>
            <ThemeToggle />
            <Button
              onClick={handleMessenger}
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
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/95 backdrop-blur-sm border-b border-border'>
            <div className='px-3 py-1 text-xs uppercase text-muted-foreground'>
              Explore
            </div>
            {navGroups[0].items.map((item) => (
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
              Media
            </div>
            <Link
              href='/contents'
              className='text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
              onClick={() => setIsMenuOpen(false)}
            >
              Contents
            </Link>
            <Button
              onClick={handleMessenger}
              className='w-full mt-4 bg-[hsl(var(--primary))] text-primary-foreground hover:bg-[hsl(var(--primary))]/90'
            >
              Book Now via Messenger
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
