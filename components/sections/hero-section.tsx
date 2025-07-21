'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Phone, Music, Zap, Volume2 } from 'lucide-react'
import companyData from '@/data/company.json'
import Image from 'next/image'
import heroBg1 from '@/public/hero-bg.jpg'
import heroBg2 from '@/public/hero-bg-2.jpg'
import heroBg3 from '@/public/hero-bg-3.jpg'
import heroBg4 from '@/public/hero-bg-4.jpg'
import heroBg5 from '@/public/hero-bg-5.jpg'
import heroBg6 from '@/public/hero-bg-6.jpg'
import heroBg7 from '@/public/hero-bg-7.jpg'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroImages = [
    heroBg1,
    heroBg2,
    heroBg3,
    heroBg4,
    heroBg5,
    heroBg6,
    heroBg7,
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  const handleMessenger = () => {
    window.open(companyData.contact.messenger, '_blank')
  }

  const handleFacebookMessenger = () => {
    window.open(`https://m.me/${companyData.contact.facebookPageId}`, '_blank')
  }

  const handleCall = () => {
    window.open(`tel:${companyData.contact.phone}`, '_self')
  }

  // Animation variants for Framer Motion
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8, delay: 1, type: 'spring', stiffness: 200 },
    },
  }

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  }

  return (
    <section
      id='home'
      className='relative min-h-screen flex items-center justify-center overflow-hidden'
    >
      {/* Background Images with Framer Motion */}
      <div className='absolute inset-0'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className='absolute inset-0'
          >
            <Image
              src={heroImages[currentSlide] || '/placeholder.svg'}
              alt={`Rock Concert ${currentSlide + 1}`}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-black/70' />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stage Lights Effect */}
      <div className='absolute inset-0 stage-lights' />

      {/* Grid Pattern Overlay */}
      <div className='absolute inset-0 grid-pattern opacity-20' />

      {/* Content */}
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className='text-4xl sm:text-6xl lg:text-8xl font-display font-bold mb-6'
          >
            <motion.span variants={itemVariants} className='text-white'>
              {companyData.name.split(' ')[0]}
            </motion.span>
            <br />
            <motion.span variants={itemVariants} className='text-gradient'>
              {companyData.name.split(' ').slice(1).join(' ')}
            </motion.span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className='text-xl sm:text-3xl text-gray-200 mb-4 max-w-4xl mx-auto font-semibold'
          >
            {companyData.tagline}
          </motion.p>

          {/* Coverage Area */}
          <motion.p
            variants={itemVariants}
            className='text-lg text-gray-300 mb-8 max-w-3xl mx-auto'
          >
            {companyData.coverage}
          </motion.p>

          {/* Rock Icons with Framer Motion */}
          <motion.div
            variants={itemVariants}
            className='flex justify-center space-x-8 mb-8'
          >
            <motion.div variants={iconVariants}>
              <Volume2 className='w-8 h-8 text-primary' />
            </motion.div>
            <motion.div variants={iconVariants}>
              <Zap className='w-8 h-8 text-primary' />
            </motion.div>
            <motion.div variants={iconVariants}>
              <Music className='w-8 h-8 text-primary' />
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className='grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto'
          >
            {companyData.stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='text-center bg-[rgba(24,24,27,0.75)] rounded py-3 opacity-25'
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className='text-3xl sm:text-4xl font-bold text-primary mb-2'>
                  {stat.value}
                </div>
                <div className='text-gray-300 font-semibold'>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons with Framer Motion */}
          <motion.div
            variants={itemVariants}
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
          >
            <motion.button
              variants={buttonVariants}
              whileHover='hover'
              whileTap='tap'
              onClick={handleMessenger}
              className='bg-[hsl(var(--primary))] text-primary-foreground px-8 py-4 rounded-xl hover:bg-[hsl(var(--primary))]/90 transition-all duration-300 flex items-center space-x-3 text-lg font-bold glow-hover'
            >
              <MessageCircle className='w-6 h-6' />
              <span>Book Your Show - Messenger</span>
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover='hover'
              whileTap='tap'
              onClick={handleFacebookMessenger}
              className='bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center space-x-3 text-lg font-bold'
            >
              <MessageCircle className='w-6 h-6' />
              <span>Messenger</span>
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover='hover'
              whileTap='tap'
              onClick={handleCall}
              className='bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-3 text-lg font-bold'
            >
              <Phone className='w-6 h-6' />
              <span>Call Now</span>
            </motion.button>
          </motion.div>

          {/* Rock Quote */}
          <motion.div variants={itemVariants} className='mt-8'>
            <motion.p
              className='text-xl text-primary font-bold italic'
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              &quot;Turn It Up to 11!&quot; 🤘
            </motion.p>
          </motion.div>

          {/* Scroll Indicator with Framer Motion */}
          <motion.div
            className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className='w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center'
              whileHover={{ scale: 1.1, borderColor: 'hsl(var(--primary))' }}
            >
              <motion.div
                className='w-1 h-3 bg-[hsl(var(--primary))] rounded-full mt-2'
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Slide Indicators with Framer Motion */}
      <motion.div
        className='absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        {heroImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[hsl(var(--primary))]'
                : 'bg-white/30'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </motion.div>
    </section>
  )
}
