'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Check,
  Star,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { SkeletonPackage, SkeletonText } from '@/components/ui/skeleton'
import TextRotate from '@/components/ui/text-rotate'
// removed dialog imports since we now navigate directly to the package page

interface Package {
  _id: string
  name: string
  description: string
  price: number
  currency: string
  features: string[]
  equipment: string[]
  idealFor: string
  maxGuests: number
  popular: boolean
  recommendedEvents?: string[]
}

export default function PackagesSection() {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedEquipment, setExpandedEquipment] = useState<Set<string>>(
    new Set(),
  )
  // removed selected modal state; navigation is direct

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/packages')
      const data = await response.json()

      if (data.success) {
        setPackages(data.data)
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // no-op: modal removed

  const toggleEquipmentExpansion = (packageId: string) => {
    setExpandedEquipment((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(packageId)) {
        newSet.delete(packageId)
      } else {
        newSet.add(packageId)
      }
      return newSet
    })
  }

  if (isLoading) {
    return (
      <section id='packages' className='py-20 bg-muted/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              Our <span className='text-gradient'>Packages</span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Professional sound and lighting packages designed for rock bands
              and live performances.
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonPackage key={index} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='packages' className='py-20 bg-muted/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            Our{' '}
            <span className='bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent'>
              <TextRotate
                words={['Packages', 'Setups', 'Rigs']}
                intervalMs={1600}
              />
            </span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Professional sound and lighting packages designed for rock bands and
            live performances. All packages include complete setup and
            breakdown.
          </p>
        </div>

        {/* Packages Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className={`bg-card rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                pkg.popular
                  ? 'border-primary shadow-lg ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className='flex justify-center mb-4'>
                  <span className='bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center'>
                    <Star className='w-4 h-4 mr-1' />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Package Header */}
              <div className='text-center mb-6'>
                <h3 className='text-2xl font-bold mb-2'>{pkg.name}</h3>
                <p className='text-muted-foreground mb-4'>{pkg.description}</p>
                <div className='flex flex-col items-center mb-2'>
                  <span className='text-xs font-medium text-muted-foreground/80 uppercase tracking-wide mb-1'>
                    starts at
                  </span>
                  <div className='flex items-baseline'>
                    <span className='text-4xl font-bold text-gradient'>
                      {pkg.currency}
                      {pkg.price?.toLocaleString() ?? '0'}
                    </span>
                    <span className='text-sm text-muted-foreground ml-1'>
                      / per event
                    </span>
                  </div>
                </div>
                <p className='text-sm text-muted-foreground'>
                  Perfect for {pkg.idealFor} • Up to {pkg.maxGuests} guests
                </p>
              </div>

              {/* Features */}
              {pkg.features && pkg.features.length > 0 && (
                <div className='space-y-3 mb-8'>
                  {pkg.features.map((feature, index) => (
                    <div key={index} className='flex items-start'>
                      <Check className='w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0' />
                      <span className='text-sm'>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Equipment Preview */}
              {pkg.equipment && pkg.equipment.length > 0 && (
                <div className='mb-8'>
                  <h4 className='font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide'>
                    Equipment Included:
                  </h4>
                  <div className='space-y-2'>
                    {pkg.equipment.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className='text-xs text-muted-foreground flex items-center'
                      >
                        <span className='w-1.5 h-1.5 bg-[hsl(var(--primary))] rounded-full mr-2'></span>
                        {item}
                      </div>
                    ))}
                    {expandedEquipment.has(pkg._id) &&
                      pkg.equipment.slice(3).map((item, index) => (
                        <div
                          key={index + 3}
                          className='text-xs text-muted-foreground flex items-center'
                        >
                          <span className='w-1.5 h-1.5 bg-[hsl(var(--primary))] rounded-full mr-2'></span>
                          {item}
                        </div>
                      ))}
                    {pkg.equipment.length > 3 && (
                      <button
                        onClick={() => toggleEquipmentExpansion(pkg._id)}
                        className='text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1 cursor-pointer'
                      >
                        <span>
                          {expandedEquipment.has(pkg._id)
                            ? `-${pkg.equipment.length - 3} less items`
                            : `+${pkg.equipment.length - 3} more items`}
                        </span>
                        {expandedEquipment.has(pkg._id) ? (
                          <ChevronUp className='w-3 h-3' />
                        ) : (
                          <ChevronDown className='w-3 h-3' />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <Link
                href={`/packages/${pkg._id}`}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white hover:from-emerald-500 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                    : 'bg-[hsl(var(--primary))] text-primary-foreground hover:bg-[hsl(var(--primary))]/90'
                }`}
              >
                <MessageCircle className='w-4 h-4' />
                <span>Book This Package</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className='text-center mt-16'>
          <p className='text-muted-foreground mb-6'>
            Need a custom package? We can tailor our services to meet your
            specific needs.
          </p>
          <Link
            href='/contact'
            className='inline-block bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-3 rounded-lg font-semibold transition-colors'
          >
            Contact Us for Custom Quote
          </Link>
        </div>
      </div>

      {/* Modal removed; direct navigation to package detail page */}
    </section>
  )
}
