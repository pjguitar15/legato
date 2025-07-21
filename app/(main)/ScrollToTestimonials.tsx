"use client"
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ScrollToTestimonials() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const source = searchParams.get('source')
    if (source === 'feedback') {
      setTimeout(() => {
        const testimonialsSection = document.getElementById('testimonials')
        if (testimonialsSection) {
          testimonialsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }, 500)
    }
  }, [searchParams])

  return null
}
