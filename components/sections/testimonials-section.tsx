'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote, User } from 'lucide-react'
import Image from 'next/image'

interface Testimonial {
  _id: string
  name: string
  event: string
  date: string
  rating: number
  feedback: string
  location: string
  image?: string
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [testimonials.length])

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/testimonials')
      const data = await response.json()

      if (data.success) {
        setTestimonials(data.data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    )
  }

  if (isLoading) {
    return (
      <section id='testimonials' className='py-20 bg-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              What Our <span className='text-gradient'>Clients Say</span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Don't just take our word for it. Here's what our clients have to
              say about their experience with Legato.
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className='max-w-4xl mx-auto'>
            <div className='bg-card rounded-3xl p-8 border animate-pulse'>
              <div className='flex items-center justify-center mb-6'>
                <div className='w-20 h-20 bg-muted rounded-full'></div>
              </div>
              <div className='text-center space-y-4'>
                <div className='h-6 bg-muted rounded w-3/4 mx-auto'></div>
                <div className='h-4 bg-muted rounded w-full'></div>
                <div className='h-4 bg-muted rounded w-2/3 mx-auto'></div>
                <div className='h-4 bg-muted rounded w-1/2 mx-auto'></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section id='testimonials' className='py-20 bg-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              What Our <span className='text-gradient'>Clients Say</span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              We're building our reputation one event at a time. Check back soon
              for client testimonials!
            </p>
          </div>
        </div>
      </section>
    )
  }

  const currentTestimonial = testimonials[activeTestimonial]

  return (
    <section id='testimonials' className='py-20 bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            What Our <span className='text-gradient'>Clients Say</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Don't just take our word for it. Here's what our clients have to say
            about their experience with Legato.
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className='max-w-4xl mx-auto mb-16'>
          <div className='relative bg-card rounded-3xl p-8 md:p-12 border shadow-lg'>
            {/* Quote Icon */}
            <div className='absolute top-6 left-6'>
              <Quote className='w-8 h-8 text-primary/30' />
            </div>

            {/* Navigation Buttons */}
            <div className='absolute top-6 right-6 flex space-x-2'>
              <button
                onClick={prevTestimonial}
                className='p-2 rounded-full bg-background hover:bg-accent transition-colors'
                disabled={testimonials.length <= 1}
              >
                <ChevronLeft className='w-5 h-5' />
              </button>
              <button
                onClick={nextTestimonial}
                className='p-2 rounded-full bg-background hover:bg-accent transition-colors'
                disabled={testimonials.length <= 1}
              >
                <ChevronRight className='w-5 h-5' />
              </button>
            </div>

            {/* Testimonial Content */}
            <div className='text-center pt-8'>
              {/* Customer Photo */}
              <div className='flex justify-center mb-6'>
                {currentTestimonial.image ? (
                  <Image
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    width={80}
                    height={80}
                    className='w-20 h-20 rounded-full object-cover border-4 border-primary'
                  />
                ) : (
                  <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center border-4 border-primary'>
                    <User className='w-8 h-8 text-muted-foreground' />
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className='flex justify-center mb-6'>
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-6 h-6 text-yellow-400 fill-current'
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className='text-xl md:text-2xl font-medium text-foreground mb-6 leading-relaxed'>
                &ldquo;{currentTestimonial.feedback}&rdquo;
              </blockquote>

              {/* Customer Info */}
              <div className='space-y-1'>
                <p className='font-semibold text-lg'>
                  {currentTestimonial.name}
                </p>
                <p className='text-primary font-medium'>
                  {currentTestimonial.event}
                </p>
                <p className='text-muted-foreground text-sm'>
                  {currentTestimonial.location} •{' '}
                  {new Date(currentTestimonial.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial Indicators */}
          {testimonials.length > 1 && (
            <div className='flex justify-center mt-8 space-x-2'>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* All Testimonials Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <div
              key={testimonial._id}
              className={`bg-card rounded-xl p-6 border transition-all duration-300 hover:shadow-md cursor-pointer ${
                index === activeTestimonial
                  ? 'border-primary shadow-lg'
                  : 'border-border'
              }`}
              onClick={() => setActiveTestimonial(index)}
            >
              {/* Mini testimonial header */}
              <div className='flex items-center space-x-3 mb-4'>
                {testimonial.image ? (
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className='w-10 h-10 rounded-full object-cover'
                  />
                ) : (
                  <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center'>
                    <User className='w-5 h-5 text-muted-foreground' />
                  </div>
                )}
                <div>
                  <p className='font-semibold text-sm'>{testimonial.name}</p>
                  <p className='text-xs text-primary'>{testimonial.event}</p>
                </div>
              </div>

              {/* Rating */}
              <div className='flex mb-3'>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 text-yellow-400 fill-current'
                  />
                ))}
              </div>

              {/* Testimonial excerpt */}
              <p className='text-sm text-muted-foreground line-clamp-3'>
                &ldquo;{testimonial.feedback}&rdquo;
              </p>

              {/* Location and date */}
              <div className='mt-4 text-xs text-muted-foreground'>
                {testimonial.location} •{' '}
                {new Date(testimonial.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
