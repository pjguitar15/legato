'use client'

import { Check, Star, MessageCircle } from 'lucide-react'
import packagesData from '@/data/packages.json'
import companyData from '@/data/company.json'

export default function PackagesSection() {
  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${companyData.contact.whatsapp.replace(/[^0-9]/g, '')}`,
      '_blank',
    )
  }

  return (
    <section id='packages' className='py-20 bg-muted/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            Our <span className='text-gradient'>Packages</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Professional sound and lighting packages designed for rock bands and
            live performances. All packages include complete setup and
            breakdown.
          </p>
        </div>

        {/* Packages Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {packagesData.packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-card rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                pkg.popular
                  ? 'border-primary shadow-2xl scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {/* Featured Badge */}
              {pkg.popular && (
                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                  <div className='bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2'>
                    <Star className='w-4 h-4 fill-current' />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              {/* Package Header */}
              <div className='text-center mb-8'>
                <h3 className='text-3xl font-display font-bold mb-2'>
                  {pkg.name}
                </h3>
                <p className='text-muted-foreground mb-4'>{pkg.description}</p>
                <div className='flex items-baseline justify-center space-x-2'>
                  <span className='text-5xl font-bold text-primary'>
                    {pkg.currency}
                    {pkg.price.toLocaleString()}
                  </span>
                  <span className='text-muted-foreground'>per event</span>
                </div>
              </div>

              {/* Features List */}
              <div className='space-y-4 mb-8'>
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className='flex items-start space-x-3'>
                    <Check className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                    <span className='text-foreground'>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Equipment Highlights */}
              <div className='bg-secondary/50 rounded-2xl p-6 mb-8'>
                <h4 className='font-semibold mb-3 text-primary'>
                  Equipment Highlights:
                </h4>
                <div className='grid grid-cols-2 gap-2 text-sm'>
                  {pkg.equipment.map((item, idx) => (
                    <div key={idx} className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-primary rounded-full'></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Perfect For */}
              <div className='mb-8'>
                <h4 className='font-semibold mb-3'>Perfect for:</h4>
                <p className='text-muted-foreground'>{pkg.idealFor}</p>
                <p className='text-sm text-muted-foreground mt-2'>
                  Max guests: {pkg.maxGuests}
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleWhatsApp}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  pkg.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow'
                    : 'bg-secondary hover:bg-accent border border-border hover:border-primary/50'
                }`}
              >
                <MessageCircle className='w-5 h-5' />
                <span>Book This Package</span>
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className='mt-16 text-center bg-secondary/30 rounded-3xl p-8'>
          <h3 className='text-2xl font-bold mb-4'>Need a Custom Package?</h3>
          <p className='text-muted-foreground mb-6'>
            Every event is unique. Let&apos;s create a custom sound and lighting
            solution that fits your specific needs and budget.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button
              onClick={handleWhatsApp}
              className='bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2'
            >
              <MessageCircle className='w-5 h-5' />
              <span>Request Custom Quote</span>
            </button>
            <button className='bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors'>
              View Equipment Details
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
