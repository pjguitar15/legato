'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import testimonialsData from '@/data/testimonials.json'
import Image from 'next/image'

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(
        (prev) => (prev + 1) % testimonialsData.testimonials.length,
      )
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev + 1) % testimonialsData.testimonials.length,
    )
  }

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) =>
        (prev - 1 + testimonialsData.testimonials.length) %
        testimonialsData.testimonials.length,
    )
  }

  return (
    <section id='testimonials' className='py-20 bg-muted/50'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            What <span className='text-gradient'>Rockers Say</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Don&apos;t just take our word for it. Here&apos;s what bands and
            event organizers say about our sound and lighting services.
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className='relative'>
          <div className='bg-card rounded-3xl p-8 md:p-12 border border-border shadow-xl'>
            {/* Quote Icon */}
            <div className='flex justify-center mb-8'>
              <Quote className='w-12 h-12 text-primary' />
            </div>

            {/* Testimonial Content */}
            <div className='text-center'>
              <blockquote className='text-2xl md:text-3xl font-medium text-foreground mb-8 leading-relaxed'>
                &ldquo;
                {testimonialsData.testimonials[activeTestimonial].feedback}
                &rdquo;
              </blockquote>

              {/* Client Info */}
              <div className='flex items-center justify-center space-x-6'>
                <Image
                  src={
                    testimonialsData.testimonials[activeTestimonial].image ||
                    '/placeholder-user.jpg'
                  }
                  alt={testimonialsData.testimonials[activeTestimonial].name}
                  width={80}
                  height={80}
                  className='rounded-full object-cover'
                />
                <div className='text-left'>
                  <div className='font-bold text-xl'>
                    {testimonialsData.testimonials[activeTestimonial].name}
                  </div>
                  <div className='text-primary font-semibold'>
                    {testimonialsData.testimonials[activeTestimonial].event}
                  </div>
                  <div className='text-muted-foreground'>
                    {testimonialsData.testimonials[activeTestimonial].location}
                  </div>

                  {/* Star Rating */}
                  <div className='flex space-x-1 mt-2'>
                    {[
                      ...Array(
                        testimonialsData.testimonials[activeTestimonial].rating,
                      ),
                    ].map((_, i) => (
                      <Star
                        key={i}
                        className='w-5 h-5 text-yellow-500 fill-current'
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className='absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-10'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>

          <button
            onClick={nextTestimonial}
            className='absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-10'
          >
            <ChevronRight className='w-6 h-6' />
          </button>
        </div>

        {/* Testimonial Indicators */}
        <div className='flex justify-center space-x-2 mt-8'>
          {testimonialsData.testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeTestimonial
                  ? 'bg-primary'
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* Additional Testimonials Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16'>
          {testimonialsData.testimonials
            .slice(0, 3)
            .map((testimonial, index) => (
              <div
                key={index}
                className='bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-colors'
              >
                <div className='flex items-center space-x-4 mb-4'>
                  <Image
                    src={testimonial.image || '/placeholder-user.jpg'}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className='rounded-full object-cover'
                  />
                  <div>
                    <div className='font-semibold'>{testimonial.name}</div>
                    <div className='text-sm text-primary'>
                      {testimonial.event}
                    </div>
                    <div className='flex space-x-1 mt-1'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className='w-4 h-4 text-yellow-500 fill-current'
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className='text-muted-foreground text-sm'>
                  &ldquo;{testimonial.feedback.substring(0, 120)}...&rdquo;
                </blockquote>
              </div>
            ))}
        </div>

        {/* Bottom CTA */}
        <div className='mt-16 text-center bg-secondary/30 rounded-3xl p-8'>
          <h3 className='text-2xl font-bold mb-4'>Ready to Rock Your Event?</h3>
          <p className='text-muted-foreground mb-6'>
            Join hundreds of satisfied bands and event organizers who trust
            Legato for their sound and lighting needs.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors'>
              Get Your Quote Today
            </button>
            <button className='bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors'>
              See Our Portfolio
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
