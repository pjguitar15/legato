'use client'

import { Phone, MessageCircle, Mail, MapPin, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import companyData from '@/data/company.json'

export default function ContactSection() {
  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${companyData.contact.whatsapp.replace(/[^0-9]/g, '')}`,
      '_blank',
    )
  }

  const handleFacebookMessenger = () => {
    window.open(`https://m.me/${companyData.contact.facebookPageId}`, '_blank')
  }

  const handleCall = () => {
    window.open(`tel:${companyData.contact.phone}`, '_self')
  }

  const handleEmail = () => {
    window.open(`mailto:${companyData.contact.email}`, '_self')
  }

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
                {/* WhatsApp */}
                <Card
                  className='border-primary/20 hover:border-primary/50 transition-colors cursor-pointer'
                  onClick={handleWhatsApp}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-4'>
                      <div className='bg-green-500 p-3 rounded-full'>
                        <MessageCircle className='w-6 h-6 text-white' />
                      </div>
                      <div>
                        <h4 className='font-semibold'>
                          WhatsApp (Recommended)
                        </h4>
                        <p className='text-muted-foreground'>
                          {companyData.contact.whatsapp}
                        </p>
                        <p className='text-sm text-green-600'>
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
                  onClick={handleFacebookMessenger}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-4'>
                      <div className='bg-blue-600 p-3 rounded-full'>
                        <MessageCircle className='w-6 h-6 text-white' />
                      </div>
                      <div>
                        <h4 className='font-semibold'>Facebook Messenger</h4>
                        <p className='text-muted-foreground'>
                          @{companyData.contact.facebookPageId}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Chat with us on Facebook
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
                        {companyData.address.street}
                      </p>
                      <p className='text-muted-foreground'>
                        {companyData.address.city},{' '}
                        {companyData.address.zipCode}
                      </p>
                    </div>
                    <div>
                      <h4 className='font-semibold text-primary'>
                        Coverage Areas
                      </h4>
                      <ul className='text-muted-foreground space-y-1'>
                        <li>✓ Trece Martires, Cavite</li>
                        <li>✓ Metro Manila</li>
                        <li>✓ Cavite Province</li>
                        <li>✓ Nearby Laguna areas</li>
                        <li>✓ Batangas (selected areas)</li>
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
                onClick={handleWhatsApp}
                className='w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6'
              >
                <MessageCircle className='w-5 h-5 mr-2' />
                Get Instant Quote via WhatsApp
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
