"use client"

import { useState, useEffect } from "react"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import testimonialsData from "@/data/testimonials.json"

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialsData.testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonialsData.testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonialsData.testimonials.length) % testimonialsData.testimonials.length,
    )
  }

  return (
    <section id="testimonials" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Customer <span className="text-gradient">Feedback</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience with
            LEGATO.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-2xl">
            {/* Quote Icon */}
            <div className="flex justify-center mb-8">
              <Quote className="w-16 h-16 text-primary/30" />
            </div>

            {/* Testimonial Content */}
            <div className="text-center">
              <blockquote className="text-xl lg:text-2xl font-medium mb-8 leading-relaxed">
                "{testimonialsData.testimonials[currentTestimonial].feedback}"
              </blockquote>

              {/* Rating */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonialsData.testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Client Info */}
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonialsData.testimonials[currentTestimonial].image || "/placeholder.svg"}
                  alt={testimonialsData.testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                />
                <div className="text-left">
                  <div className="font-semibold text-lg">{testimonialsData.testimonials[currentTestimonial].name}</div>
                  <div className="text-primary font-medium">
                    {testimonialsData.testimonials[currentTestimonial].event}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonialsData.testimonials[currentTestimonial].location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-[hsl(var(--primary))] text-primary-foreground p-3 rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-[hsl(var(--primary))] text-primary-foreground p-3 rounded-full hover:bg-[hsl(var(--primary))]/90 transition-colors shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonialsData.testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial ? "bg-[hsl(var(--primary))]" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* All Testimonials Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonialsData.testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-card rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl cursor-pointer ${
                index === currentTestimonial ? "border-primary glow" : "border-border hover:border-primary/50"
              }`}
              onClick={() => setCurrentTestimonial(index)}
            >
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Feedback */}
              <p className="text-sm mb-4 line-clamp-4">"{testimonial.feedback}"</p>

              {/* Client Info */}
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.event}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
