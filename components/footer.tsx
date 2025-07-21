'use client'

import Link from 'next/link'
import {
  Facebook,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Youtube,
} from 'lucide-react'
import Image from 'next/image'
import whiteLogo from '@/public/Legato Landscape.png'
import blackLogo from '@/public/Legato Landscape Black.png'
import { useCompanyData } from '@/hooks/use-company-data'
import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { companyData, isLoading } = useCompanyData()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <footer className='bg-[hsl(var(--secondary)/0.5)] border-t border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div className='col-span-1 md:col-span-2 space-y-4'>
              <Skeleton className='h-8 w-32' />
              <Skeleton className='h-16 w-full' />
              <div className='flex space-x-4'>
                <Skeleton className='h-10 w-10 rounded-lg' />
                <Skeleton className='h-10 w-10 rounded-lg' />
              </div>
            </div>
            <div className='space-y-4'>
              <Skeleton className='h-6 w-24' />
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className='h-4 w-20' />
              ))}
            </div>
            <div className='space-y-4'>
              <Skeleton className='h-6 w-24' />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          </div>
        </div>
      </footer>
    )
  }

  if (!companyData) return null

  return (
    <footer className='bg-bg-[hsl(var(--secondary)/0.5)] border-t border-border'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='col-span-1 md:col-span-2'>
            <div className='flex items-center space-x-3 mb-4'>
              <Image
                src={theme === 'light' ? blackLogo : whiteLogo}
                alt={companyData.name}
                width={120}
                height={40}
                className='h-8 w-auto transition-opacity duration-300'
              />
            </div>
            <p className='text-muted-foreground mb-4 max-w-md'>
              {companyData.footerDescription || companyData.description}
            </p>
            <div className='flex space-x-4'>
              {companyData.socialMedia?.facebook && (
                <Link
                  href={companyData.socialMedia.facebook}
                  target='_blank'
                  className='p-2 bg-background rounded-lg hover:bg-accent transition-colors glow-hover'
                  title='Facebook Page'
                >
                  <Facebook className='w-5 h-5' />
                </Link>
              )}
              {companyData.socialMedia?.messenger && (
                <Link
                  href={companyData.socialMedia.messenger}
                  target='_blank'
                  className='p-2 bg-background rounded-lg hover:bg-accent transition-colors glow-hover'
                  title='Facebook Messenger'
                >
                  <MessageCircle className='w-5 h-5' />
                </Link>
              )}
              {companyData.socialMedia?.youtube && (
                <Link
                  href={companyData.socialMedia.youtube}
                  target='_blank'
                  className='p-2 bg-background rounded-lg hover:bg-accent transition-colors glow-hover'
                  title='YouTube Channel'
                >
                  <Youtube className='w-5 h-5' />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='font-semibold text-foreground mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              {[
                'Home',
                'Packages',
                'Equipment',
                'Gallery',
                'Events',
                'About',
                'Contact',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='font-semibold text-foreground mb-4'>Contact Info</h3>
            <ul className='space-y-3'>
              <li className='flex items-start space-x-3'>
                <MapPin className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                <span className='text-muted-foreground text-sm'>
                  {companyData.contact.address}, {companyData.contact.city},{' '}
                  {companyData.contact.province} {companyData.contact.zipCode}
                </span>
              </li>
              <li className='flex items-center space-x-3'>
                <Phone className='w-5 h-5 text-primary flex-shrink-0' />
                <span className='text-muted-foreground text-sm'>
                  {companyData.contact.phone}
                </span>
              </li>
              <li className='flex items-center space-x-3'>
                <Mail className='w-5 h-5 text-primary flex-shrink-0' />
                <span className='text-muted-foreground text-sm'>
                  {companyData.contact.email}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-border mt-12 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <p className='text-muted-foreground text-sm'>
              © {currentYear} {companyData.name}. All rights reserved.
            </p>
            <div className='flex items-center space-x-6'>
              <Link
                href='/privacy'
                className='text-muted-foreground hover:text-primary text-sm transition-colors'
              >
                Privacy Policy
              </Link>
              <Link
                href='/terms'
                className='text-muted-foreground hover:text-primary text-sm transition-colors'
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
