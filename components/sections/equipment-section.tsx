'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useInView, type Variants } from 'framer-motion'
import { useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface EquipmentItem {
  _id?: string
  name: string
  type: string
  description: string
  image?: string
  features: string[]
  brand: string
}

interface EquipmentCategory {
  _id?: string
  name: string
  items: EquipmentItem[]
}

export default function EquipmentSection() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [equipmentData, setEquipmentData] = useState<EquipmentCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/equipment')
      const data = await response.json()

      if (data.success && data.data) {
        // Ensure "Audio Equipment" tab is first if present
        const list: EquipmentCategory[] = data.data
        const audioIndex = list.findIndex((c) => /audio/i.test(c.name || ''))
        const reordered = [...list]
        if (audioIndex > 0) {
          const [audio] = reordered.splice(audioIndex, 1)
          reordered.unshift(audio)
        }
        setEquipmentData(reordered)
        setActiveCategory(0)
      }
    } catch (error) {
      console.error('Error fetching equipment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextCategory = () => {
    setActiveCategory((prev) => (prev + 1) % equipmentData.length)
  }

  const prevCategory = () => {
    setActiveCategory(
      (prev) => (prev - 1 + equipmentData.length) % equipmentData.length,
    )
  }

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -10,
      scale: 1.05,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  }

  if (isLoading) {
    return (
      <section id='equipment' className='py-20' ref={ref}>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <Skeleton className='h-12 w-96 mx-auto mb-6' />
            <Skeleton className='h-6 w-2/3 mx-auto' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-64 w-full rounded-xl' />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!equipmentData || equipmentData.length === 0) {
    return (
      <section id='equipment' className='py-20' ref={ref}>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              Our <span className='text-gradient'>Equipment</span>
            </h2>
            <p className='text-xl text-muted-foreground'>
              No equipment data available at the moment.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='equipment' className='py-20' ref={ref}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-16'
        >
          <motion.h2
            className='text-4xl sm:text-5xl font-display font-bold mb-6'
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our{' '}
            <span className='bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent'>
              Equipment
            </span>
          </motion.h2>
          <motion.p
            className='text-xl text-muted-foreground max-w-3xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Industry-leading brands and professional-grade equipment to ensure
            your event sounds and looks perfect.
          </motion.p>
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          className='flex justify-center mb-12'
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div
            className='flex space-x-4 bg-bg-[hsl(var(--secondary)/0.5)]
 rounded-xl p-2'
          >
            {equipmentData.map((category, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 ${
                  activeCategory === index
                    ? 'bg-[hsl(var(--primary))] text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Equipment Grid */}
        <div className='relative'>
          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            variants={containerVariants}
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
            key={activeCategory} // This will trigger re-animation when category changes
          >
            {equipmentData[activeCategory]?.items?.map(
              (item: EquipmentItem, index: number) => (
                <motion.div
                  key={item._id || index}
                  className='bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl'
                  variants={cardVariants}
                  whileHover='hover'
                  initial='hidden'
                  animate='visible'
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Equipment Image */}
                  <motion.div
                    className='aspect-video bg-secondary/30 relative overflow-hidden'
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className='w-full h-full object-cover'
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.div
                      className='absolute top-4 right-4'
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    >
                      <span className='bg-[hsl(var(--primary))] text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold'>
                        {item.brand}
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Equipment Info */}
                  <motion.div
                    className='p-6'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  >
                    <div className='mb-2'>
                      <motion.h3
                        className='text-xl font-bold'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        {item.name}
                      </motion.h3>
                      <motion.p
                        className='text-primary font-semibold'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        {item.type}
                      </motion.p>
                    </div>

                    <motion.p
                      className='text-muted-foreground mb-4 text-sm'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      {item.description}
                    </motion.p>

                    {/* Features */}
                    <div className='space-y-2'>
                      {item.features.map((feature: string, idx: number) => (
                        <motion.div
                          key={idx}
                          className='flex items-center space-x-2'
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 + idx * 0.05 }}
                        >
                          <motion.div
                            className='w-2 h-2 bg-[hsl(var(--primary))] rounded-full'
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.8 + index * 0.1 + idx * 0.05,
                              type: 'spring',
                            }}
                          />
                          <span className='text-sm'>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ),
            )}
          </motion.div>

          {/* Navigation Arrows with Framer Motion */}
          <motion.button
            onClick={prevCategory}
            className='absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-[hsl(var(--primary))] text-primary-foreground p-3 rounded-full shadow-lg hover:bg-[hsl(var(--primary))]/90 transition-colors z-10'
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 1.2 }}
          >
            <ChevronLeft className='w-6 h-6' />
          </motion.button>

          <motion.button
            onClick={nextCategory}
            className='absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-[hsl(var(--primary))] text-primary-foreground p-3 rounded-full shadow-lg hover:bg-[hsl(var(--primary))]/90 transition-colors z-10'
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: 1.2 }}
          >
            <ChevronRight className='w-6 h-6' />
          </motion.button>
        </div>

        {/* Brand Trust Section */}
        <div className='mt-16 text-center'>
          <h3 className='text-2xl font-display font-bold mb-8'>
            Trusted Brands We Use
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60'>
            {['RCF', 'Allen & Heath', 'Shure', 'Pearl', 'Chauvet'].map(
              (brand) => (
                <div
                  key={brand}
                  className='text-xl font-bold text-muted-foreground hover:text-primary transition-colors'
                >
                  {brand}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
