'use client'

import { useState } from 'react'
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import eventsData from '@/data/events.json'
import Image from 'next/image'

export default function EventsSection() {
  const [activeEvent, setActiveEvent] = useState(0)

  const nextEvent = () => {
    setActiveEvent((prev) => (prev + 1) % eventsData.events.length)
  }

  const prevEvent = () => {
    setActiveEvent(
      (prev) =>
        (prev - 1 + eventsData.events.length) % eventsData.events.length,
    )
  }

  return (
    <section id='events' className='py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            Recent <span className='text-gradient'>Events</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Relive the energy of our recent rock concerts and live events. Every
            show is a testament to our commitment to excellence.
          </p>
        </div>

        {/* Featured Event */}
        <div className='relative mb-16'>
          <div className='bg-card rounded-3xl overflow-hidden border border-border shadow-xl'>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              {/* Event Image */}
              <div className='relative aspect-square lg:aspect-auto'>
                <Image
                  src={
                    eventsData.events[activeEvent].image || '/placeholder.svg'
                  }
                  alt={eventsData.events[activeEvent].title}
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-black/20' />

                {/* Event Type Badge */}
                <div className='absolute top-6 left-6'>
                  <span className='bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold'>
                    {eventsData.events[activeEvent].eventType}
                  </span>
                </div>

                {/* Rating */}
                <div className='absolute top-6 right-6 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2'>
                  <div className='flex items-center space-x-1'>
                    <Star className='w-4 h-4 text-yellow-500 fill-current' />
                    <span className='text-white text-sm font-semibold'>
                      5.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className='p-8 lg:p-12'>
                <h3 className='text-3xl font-bold mb-4'>
                  {eventsData.events[activeEvent].title}
                </h3>
                <p className='text-muted-foreground mb-6 leading-relaxed'>
                  {eventsData.events[activeEvent].description}
                </p>

                {/* Event Info Grid */}
                <div className='grid grid-cols-2 gap-6 mb-8'>
                  <div className='flex items-center space-x-3'>
                    <Calendar className='w-5 h-5 text-primary' />
                    <div>
                      <div className='text-sm text-muted-foreground'>Date</div>
                      <div className='font-semibold'>
                        {eventsData.events[activeEvent].date}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <MapPin className='w-5 h-5 text-primary' />
                    <div>
                      <div className='text-sm text-muted-foreground'>
                        Location
                      </div>
                      <div className='font-semibold'>
                        {eventsData.events[activeEvent].location}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <Users className='w-5 h-5 text-primary' />
                    <div>
                      <div className='text-sm text-muted-foreground'>
                        Package
                      </div>
                      <div className='font-semibold'>
                        {eventsData.events[activeEvent].package}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <Clock className='w-5 h-5 text-primary' />
                    <div>
                      <div className='text-sm text-muted-foreground'>Type</div>
                      <div className='font-semibold'>
                        {eventsData.events[activeEvent].eventType}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Highlights */}
                <div className='mb-8'>
                  <h4 className='font-semibold mb-3'>Event Highlights:</h4>
                  <div className='grid grid-cols-1 gap-2'>
                    {eventsData.events[activeEvent].highlights.map(
                      (item, index) => (
                        <div
                          key={index}
                          className='flex items-center space-x-2'
                        >
                          <div className='w-2 h-2 bg-primary rounded-full' />
                          <span className='text-sm'>{item}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Client Testimonial Placeholder */}
                <div className='bg-secondary/50 rounded-xl p-4 mb-6'>
                  <div className='flex items-center space-x-3 mb-3'>
                    <Image
                      src='/placeholder-user.jpg'
                      alt='Event Client'
                      width={40}
                      height={40}
                      className='rounded-full object-cover'
                    />
                    <div>
                      <div className='font-semibold text-sm'>
                        Event Organizer
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        Satisfied Client
                      </div>
                    </div>
                  </div>
                  <blockquote className='text-sm italic'>
                    &quot;Legato delivered an amazing experience for our event.
                    Professional service and outstanding quality!&quot;
                  </blockquote>
                </div>

                {/* CTA Button */}
                <button className='w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-colors font-semibold'>
                  Book Similar Event
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevEvent}
            className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-10'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>

          <button
            onClick={nextEvent}
            className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-10'
          >
            <ChevronRight className='w-6 h-6' />
          </button>
        </div>

        {/* Event Indicators */}
        <div className='flex justify-center space-x-2 mb-16'>
          {eventsData.events.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveEvent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeEvent ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* All Events Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {eventsData.events.map((event, index) => (
            <div
              key={event.id}
              className={`bg-card rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl cursor-pointer ${
                index === activeEvent
                  ? 'border-primary glow'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setActiveEvent(index)}
            >
              {/* Event Image */}
              <div className='aspect-video relative'>
                <Image
                  src={event.image || '/placeholder.svg'}
                  alt={event.title}
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-black/20' />

                {/* Event Type */}
                <div className='absolute top-4 left-4'>
                  <span className='bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold'>
                    {event.eventType}
                  </span>
                </div>

                {/* Rating */}
                <div className='absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1'>
                  <div className='flex items-center space-x-1'>
                    <Star className='w-3 h-3 text-yellow-500 fill-current' />
                    <span className='text-white text-xs'>5.0</span>
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div className='p-6'>
                <h3 className='text-lg font-bold mb-2'>{event.title}</h3>
                <p className='text-muted-foreground text-sm mb-4 line-clamp-2'>
                  {event.description}
                </p>

                {/* Quick Info */}
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center space-x-2'>
                    <Calendar className='w-4 h-4 text-primary' />
                    <span>{event.date}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <MapPin className='w-4 h-4 text-primary' />
                    <span>{event.location}</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Users className='w-4 h-4 text-primary' />
                    <span>{event.package}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className='mt-16 text-center bg-secondary/30 rounded-3xl p-8'>
          <h3 className='text-2xl font-bold mb-4'>
            Ready to Rock Your Next Event?
          </h3>
          <p className='text-muted-foreground mb-6'>
            Let us bring the same energy and professionalism to your event.
            Every show is unique, every performance is legendary.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors'>
              Plan Your Event
            </button>
            <button className='bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors'>
              View Full Portfolio
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
