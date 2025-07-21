"use client"

import { Check, Star, MessageCircle } from "lucide-react"
import packagesData from "@/data/packages.json"
import companyData from "@/data/company.json"

export default function PackagesSection() {
  const handleWhatsApp = (packageName: string) => {
    const message = `Hi! I'm interested in the ${packageName}. Can you provide more details?`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${companyData.contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodedMessage}`, "_blank")
  }

  return (
    <section id='packages' className='py-20 bg-secondary/30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            Our <span className='text-gradient'>Packages</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Choose from our carefully crafted packages designed to make your
            event unforgettable. Pro Audio. Industry-Trusted Brands.
          </p>
        </div>

        {/* Packages Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {packagesData.packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative border bg-card rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                pkg.popular
                  ? 'border-primary shadow-lg glow'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                  <div className='bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1'>
                    <Star className='w-4 h-4 fill-current' />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              {/* Package Header */}
              <div className='text-center mb-8'>
                <h3 className='text-2xl font-display font-bold mb-2'>
                  {pkg.name}
                </h3>
                <div className='text-4xl font-bold text-primary mb-2'>
                  {pkg.currency}
                  {pkg.price.toLocaleString()}
                </div>
                <p className='text-muted-foreground'>{pkg.description}</p>
              </div>

              {/* Features */}
              <div className='mb-8'>
                <h4 className='font-semibold mb-4'>What's Included:</h4>
                <ul className='space-y-3'>
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className='flex items-center space-x-3'>
                      <Check className='w-5 h-5 text-primary flex-shrink-0' />
                      <span className='text-sm'>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Equipment List */}
              <div className='mb-8'>
                <h4 className='font-semibold mb-4'>Equipment:</h4>
                <ul className='space-y-2'>
                  {pkg.equipment.map((item, idx) => (
                    <li
                      key={idx}
                      className='text-sm text-muted-foreground flex items-center space-x-2'
                    >
                      <div className='w-2 h-2 bg-[hsl(var(--primary))] rounded-full flex-shrink-0' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Package Details */}
              <div
                className='mb-8 p-4 bg-bg-[hsl(var(--secondary)/0.5)]
 rounded-lg'
              >
                <div className='text-sm space-y-2'>
                  <div>
                    <strong>Ideal for:</strong> {pkg.idealFor}
                  </div>
                  <div>
                    <strong>Max Guests:</strong> {pkg.maxGuests}
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleWhatsApp(pkg.name)}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  pkg.popular
                    ? 'bg-[hsl(var(--primary))] text-primary-foreground hover:bg-[hsl(var(--primary))]/90 glow-hover'
                    : 'bg-secondary hover:bg-accent border border-border hover:border-primary/50'
                }`}
              >
                <MessageCircle className='w-5 h-5' />
                <span>Book This Package</span>
              </button>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className='mt-16 text-center'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>100%</div>
              <div className='text-sm text-muted-foreground'>
                Satisfaction Rate
              </div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>24/7</div>
              <div className='text-sm text-muted-foreground'>Support</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>Pro</div>
              <div className='text-sm text-muted-foreground'>Equipment</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>Trusted</div>
              <div className='text-sm text-muted-foreground'>Brands</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
