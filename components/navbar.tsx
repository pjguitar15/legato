'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Volume2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useCompanyData } from '@/hooks/use-company-data'
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

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#packages', label: 'Packages' },
    { href: '#equipment', label: 'Equipment' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#events', label: 'Events' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ]

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80 // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      })
    }
    setIsMenuOpen(false)
  }

  const handleMessenger = () => {
    if (companyData?.socialMedia?.messenger) {
      window.open(companyData.socialMedia.messenger, '_blank')
    }
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

          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-4'>
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className='text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'
                >
                  {item.label}
                </a>
              ))}
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
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className='text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200'
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
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
