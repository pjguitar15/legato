'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'

type Pkg = {
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
  image?: string
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Pkg[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  // no modal on this page; selection navigates to details

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/packages')
      const json = await res.json()
      if (json.success) setPackages(json.data)
    })()
  }, [])

  return (
    <section className='pt-28 pb-20 bg-muted/40 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-6'>
          <Link
            href='/'
            className='inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition-colors'
          >
            ← Back to home
          </Link>
        </div>
        <div className='text-center mb-12'>
          <h1 className='text-4xl sm:text-6xl font-display font-bold mb-4'>
            Choose Your <span className='text-gradient'>Package</span>
          </h1>
          <p className='text-muted-foreground text-lg'>
            Hand‑picked setups for gigs of every size. Hover to see what each
            package is perfect for.
          </p>
        </div>
        <div className='relative flex flex-col gap-10'>
          {packages.map((pkg) => (
            <motion.div
              key={pkg._id}
              onHoverStart={() => setHoveredId(pkg._id)}
              onHoverEnd={() =>
                setHoveredId((id) => (id === pkg._id ? null : id))
              }
              animate={{ scale: hoveredId === pkg._id ? 1.01 : 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className='relative w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm group'
            >
              {/* Background image */}
              <div className='relative h-64 sm:h-80 w-full'>
                <Image
                  src={
                    pkg.image && pkg.image.length > 0
                      ? pkg.image
                      : '/placeholder.jpg'
                  }
                  alt={`${pkg.name} preview`}
                  fill
                  className='object-cover'
                />
                {/* darken rest on hover */}
                <motion.div
                  className='absolute inset-0 bg-black/60'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === pkg._id ? 1 : 0 }}
                />
                {/* Netflixy hover info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredId === pkg._id ? 1 : 0,
                    y: hoveredId === pkg._id ? 0 : 20,
                  }}
                  className='absolute inset-0 flex items-end p-6 text-white'
                >
                  <div>
                    <div className='text-2xl font-extrabold drop-shadow'>
                      {pkg.name}
                    </div>
                    <div className='mt-2 text-sm opacity-90 line-clamp-2'>
                      {pkg.description}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Content row */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 p-6'>
                <div>
                  <h3 className='text-2xl font-bold'>{pkg.name}</h3>
                  <p className='text-muted-foreground mt-1'>
                    {pkg.description}
                  </p>
                  <div className='mt-4 flex items-baseline gap-2'>
                    <span className='text-4xl font-extrabold text-gradient'>
                      {pkg.currency}
                      {pkg.price?.toLocaleString()}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      starts at
                    </span>
                  </div>
                  <div className='mt-4 flex flex-wrap gap-2'>
                    {(pkg.recommendedEvents?.length
                      ? pkg.recommendedEvents
                      : pkg.idealFor.split(',')
                    ).map((tag, idx) => (
                      <span
                        key={idx}
                        className='rounded-full bg-muted px-3 py-1 text-xs'
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className='self-center'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
                    {pkg.features.slice(0, 6).map((f, i) => (
                      <div key={i} className='flex items-start'>
                        <Check className='mr-2 mt-0.5 h-4 w-4 text-primary' />{' '}
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className='mt-5 flex gap-3'>
                    <Link
                      href={`/packages/${pkg._id}`}
                      className='rounded-lg bg-[hsl(var(--primary))] px-6 py-3 font-semibold text-primary-foreground transition hover:bg-[hsl(var(--primary))]/90 inline-block ring-2 ring-transparent group-hover:ring-[hsl(var(--primary))]'
                    >
                      Book this package
                    </Link>
                    <Link
                      href={`/packages/${pkg._id}`}
                      className='rounded-lg border px-6 py-3 font-semibold hover:border-primary hover:text-primary ring-2 ring-transparent group-hover:ring-primary'
                    >
                      View events
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Removed global dim overlay and modal; navigation goes to package detail */}
    </section>
  )
}
