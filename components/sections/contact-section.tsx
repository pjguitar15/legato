'use client'

import { Phone, MessageCircle, Mail, MapPin, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCompanyData } from '@/hooks/use-company-data'
import { Skeleton } from '@/components/ui/skeleton'
import { useMessenger } from '@/contexts/messenger-context'

export default function ContactSection() {
  const { companyData, isLoading } = useCompanyData()
  const { openMessenger } = useMessenger()

  const handleMessenger = () => {
    openMessenger()
  }

  const handleCall = () => {
    if (companyData?.contact?.phone) {
      window.open(`tel:${companyData.contact.phone}`, '_self')
    }
  }

  const handleEmail = () => {
    if (companyData?.contact?.email) {
      window.open(`mailto:${companyData.contact.email}`, '_self')
    }
  }

  if (isLoading) {
    return (
      <section id='contact' className='py-20 bg-muted/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <Skeleton className='h-12 w-96 mx-auto mb-6' />
            <Skeleton className='h-6 w-2/3 mx-auto' />
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            <div className='space-y-6'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className='border-border'>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-4'>
                      <Skeleton className='h-12 w-12 rounded-full' />
                      <div className='space-y-2 flex-1'>
                        <Skeleton className='h-5 w-20' />
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-3 w-40' />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className='space-y-6'>
              <Skeleton className='h-48 w-full rounded-xl' />
              <Skeleton className='h-24 w-full rounded-xl' />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!companyData) return null

  return (
    <section id='contact' className='py-20 bg-muted/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            Let&apos;s Make Your Event{' '}
            <span className='text-gradient'>Legendary</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Ready to turn up the volume? Contact us today for professional sound
            and lighting that will make your event unforgettable.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Information */}
          <div className='space-y-8'>
            <div>
              <h3 className='text-2xl font-display font-bold mb-6'>
                Get in Touch
              </h3>
              <div className='space-y-4'>
                {/* Messenger */}
                <Card
                  className='border-primary/20 hover:border-primary/50 transition-colors cursor-pointer'
                  onClick={handleMessenger}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-4'>
                      <div className='bg-blue-500 p-3 rounded-full'>
                        <MessageCircle className='w-6 h-6 text-white' />
                      </div>
                      <div>
                        <h4 className='font-semibold'>
                          Facebook Messenger (Recommended)
                        </h4>
                        <p className='text-muted-foreground'>
                          m.me/legatosounds
                        </p>
                        <p className='text-sm text-blue-600'>
                          Instant quotes & fast response!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Phone */}
                <Card
                  className='border-border hover:border-primary/50 transition-colors cursor-pointer'
                  onClick={handleCall}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-4'>
                      <div className='bg-blue-500 p-3 rounded-full'>
                        <Phone className='w-6 h-6 text-white' />
                      </div>
                      <div>
                        <h4 className='font-semibold'>Phone</h4>
                        <p className='text-muted-foreground'>
                          {companyData.contact.phone}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Call for immediate assistance
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card
                  className='border-border hover:border-primary/50 transition-colors cursor-pointer'
                  onClick={handleEmail}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-4'>
                      <div className='bg-purple-500 p-3 rounded-full'>
                        <Mail className='w-6 h-6 text-white' />
                      </div>
                      <div>
                        <h4 className='font-semibold'>Email</h4>
                        <p className='text-muted-foreground'>
                          {companyData.contact.email}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          For detailed inquiries
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Facebook Messenger */}
                <Card
                  className='border-border hover:border-primary/50 transition-colors cursor-pointer'
                  onClick={handleMessenger}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-4'>
                      <div className='bg-blue-600 p-3 rounded-full'>
                        <MessageCircle className='w-6 h-6 text-white' />
                      </div>
                      <div>
                        <h4 className='font-semibold'>Facebook Messenger</h4>
                        <p className='text-muted-foreground'>Chat with us</p>
                        <p className='text-sm text-muted-foreground'>
                          Instant messaging support
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className='text-xl font-semibold mb-4 flex items-center'>
                <Clock className='w-5 h-5 mr-2 text-primary' />
                Business Hours
              </h3>
              <div className='space-y-2 text-muted-foreground'>
                <div className='flex justify-between'>
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span>Sunday</span>
                  <span>By appointment</span>
                </div>
                <div className='flex justify-between font-semibold text-primary'>
                  <span>Event Days</span>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Area & Quick Info */}
          <div className='space-y-8'>
            {/* Service Coverage */}
            <div>
              <h3 className='text-2xl font-display font-bold mb-6 flex items-center'>
                <MapPin className='w-6 h-6 mr-2 text-primary' />
                Service Coverage
              </h3>
              <Card>
                <CardContent className='p-6'>
                  <div className='space-y-4'>
                    <div>
                      <h4 className='font-semibold text-primary'>Home Base</h4>
                      <p className='text-muted-foreground'>
                        {companyData.contact.address}
                      </p>
                      <p className='text-muted-foreground'>
                        {companyData.contact.city},{' '}
                        {companyData.contact.province}{' '}
                        {companyData.contact.zipCode}
                      </p>
                    </div>
                    <div>
                      <h4 className='font-semibold text-primary'>
                        Coverage Areas
                      </h4>
                      <ul className='text-muted-foreground space-y-1'>
                        {companyData.serviceAreas?.map((area, index) => (
                          <li key={index}>✓ {area}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Why Choose Us */}
            <div>
              <h3 className='text-xl font-semibold mb-4'>Why Choose Legato?</h3>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3'>
                  <Star className='w-5 h-5 text-yellow-500 fill-current' />
                  <span>Professional-grade equipment</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Star className='w-5 h-5 text-yellow-500 fill-current' />
                  <span>Experienced rock band specialists</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Star className='w-5 h-5 text-yellow-500 fill-current' />
                  <span>Complete setup & breakdown service</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Star className='w-5 h-5 text-yellow-500 fill-current' />
                  <span>24/7 event day support</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Star className='w-5 h-5 text-yellow-500 fill-current' />
                  <span>Competitive pricing packages</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='space-y-4'>
              <Button
                onClick={handleMessenger}
                className='w-full bg-[hsl(var(--primary))] text-primary-foreground hover:bg-[hsl(var(--primary))]/90 text-lg py-6'
              >
                <MessageCircle className='w-5 h-5 mr-2' />
                Get Instant Quote via Messenger
              </Button>
              <Button
                onClick={handleCall}
                variant='outline'
                className='w-full text-lg py-6'
              >
                <Phone className='w-5 h-5 mr-2' />
                Call for Immediate Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
