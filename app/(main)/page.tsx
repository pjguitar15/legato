'use client'

import { Suspense } from 'react'
import HeroSection from '@/components/sections/hero-section'
import PackagesSection from '@/components/sections/packages-section'
import EquipmentSection from '@/components/sections/equipment-section'
import GallerySection from '@/components/sections/gallery-section'
import EventsSection from '@/components/sections/events-section'
import TestimonialsSection from '@/components/sections/testimonials-section'
import AboutSection from '@/components/sections/about-section'
import ContactSection from '@/components/sections/contact-section'
import FAQSection from '@/components/sections/faq-section'
import ScrollToTestimonials from './ScrollToTestimonials'

export default function HomePage() {
  return (
    <div className='pt-16'>
      <Suspense>
        <ScrollToTestimonials />
      </Suspense>
      <HeroSection />
      <PackagesSection />
      <EquipmentSection />
      <GallerySection />
      <TestimonialsSection />
      <EventsSection />
      <AboutSection />
      <FAQSection />
      <ContactSection />
    </div>
  )
}
