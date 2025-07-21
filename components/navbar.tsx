"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon, Phone, MessageCircle, Music } from "lucide-react"
import companyData from "@/data/company.json"
import Image from 'next/image'
import whiteLogo from '@/public/Legato Landscape.png'
import blackLogo from '@/public/Legato Landscape Black.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Packages", href: "#packages" },
    { name: "Equipment", href: "#equipment" },
    { name: "Gallery", href: "#gallery" },
    { name: "Events", href: "#events" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ]

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${companyData.contact.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")
  }

  const handleFacebookMessenger = () => {
    window.open(`https://m.me/${companyData.contact.facebookPageId}`, "_blank")
  }

  const handleCall = () => {
    window.open(`tel:${companyData.contact.phone}`, "_self")
  }

  if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link href='#home' className='flex items-center space-x-3'>
            <div className='w-32 h-auto flex items-center justify-center'>
              <Image
                src={theme === 'light' ? blackLogo : whiteLogo}
                alt='Legato Logo'
                className='absolute w-32 h-auto transition-opacity duration-300'
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-foreground hover:text-primary transition-colors duration-200 font-medium'
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className='hidden md:flex items-center space-x-4'>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='p-2 rounded-lg bg-secondary hover:bg-accent transition-colors'
            >
              {theme === 'dark' ? (
                <Sun className='w-5 h-5' />
              ) : (
                <Moon className='w-5 h-5' />
              )}
            </button>
            <button
              onClick={handleCall}
              className='p-2 rounded-lg bg-secondary hover:bg-accent transition-colors'
            >
              <Phone className='w-5 h-5' />
            </button>
            <button
              onClick={handleFacebookMessenger}
              className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2'
            >
              <MessageCircle className='w-4 h-4' />
              <span>Messenger</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className='bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors flex items-center space-x-2 glow'
            >
              <MessageCircle className='w-4 h-4' />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center space-x-2'>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='p-2 rounded-lg bg-secondary hover:bg-accent transition-colors'
            >
              {theme === 'dark' ? (
                <Sun className='w-5 h-5' />
              ) : (
                <Moon className='w-5 h-5' />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='p-2 rounded-lg bg-secondary hover:bg-accent transition-colors'
            >
              {isOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className='md:hidden bg-background/95 backdrop-blur-md border-t border-border'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='block px-3 py-2 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors'
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className='grid grid-cols-2 gap-2 px-3 py-2'>
                <button
                  onClick={handleCall}
                  className='bg-secondary hover:bg-accent text-foreground px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2'
                >
                  <Phone className='w-4 h-4' />
                  <span>Call</span>
                </button>
                <button
                  onClick={handleFacebookMessenger}
                  className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2'
                >
                  <MessageCircle className='w-4 h-4' />
                  <span>Messenger</span>
                </button>
              </div>
              <div className='px-3 py-2'>
                <button
                  onClick={handleWhatsApp}
                  className='w-full bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors flex items-center justify-center space-x-2'
                >
                  <MessageCircle className='w-4 h-4' />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
