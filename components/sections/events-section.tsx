'use client'

import { useEffect, useState } from 'react'
import { Calendar, MapPin, Users, Clock, Zap } from 'lucide-react'
import Image from 'next/image'

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  eventType: string
  package: string
  image?: string
  highlights?: string[]
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/events')
      const data = await response.json()

      if (data.success) {
        setEvents(data.data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section id='events' className='py-20 bg-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              Recent <span className='text-gradient'>Events</span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Check out some of the amazing events we've powered with our
              professional sound and lighting services.
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className='bg-card rounded-xl overflow-hidden border animate-pulse'
              >
                <div className='h-48 bg-muted'></div>
                <div className='p-6'>
                  <div className='h-6 bg-muted rounded w-3/4 mb-3'></div>
                  <div className='h-4 bg-muted rounded w-full mb-2'></div>
                  <div className='h-4 bg-muted rounded w-2/3 mb-4'></div>
                  <div className='flex space-x-2 mb-4'>
                    <div className='h-6 bg-muted rounded w-16'></div>
                    <div className='h-6 bg-muted rounded w-20'></div>
                  </div>
                  <div className='h-4 bg-muted rounded w-1/2'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section id='events' className='py-20 bg-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              Recent <span className='text-gradient'>Events</span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              We're building our portfolio one event at a time. Check back soon
              for our latest work!
            </p>
          </div>

          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <Calendar className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Events Coming Soon</h3>
            <p className='text-muted-foreground'>
              We're working on amazing events that will be showcased here.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='events' className='py-20 bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            Recent <span className='text-gradient'>Events</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Check out some of the amazing events we've powered with our
            professional sound and lighting services.
          </p>
        </div>

        {/* Events Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {events.slice(0, 6).map((event) => (
            <div
              key={event._id}
              className='bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg hover:border-primary/50 transition-all duration-300'
            >
              {/* Event Image */}
              {event.image && (
                <div className='relative h-48 overflow-hidden'>
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className='object-cover hover:scale-105 transition-transform duration-300'
                  />
                  <div className='absolute top-3 left-3'>
                    <span className='bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium'>
                      {event.eventType}
                    </span>
                  </div>
                </div>
              )}

              {/* Event Content */}
              <div className='p-6'>
                {/* Title */}
                <h3 className='text-xl font-semibold mb-3 hover:text-primary transition-colors'>
                  {event.title}
                </h3>

                {/* Description */}
                <p className='text-muted-foreground text-sm mb-4 line-clamp-3'>
                  {event.description}
                </p>

                {/* Event Details */}
                <div className='space-y-2 mb-4'>
                  <div className='flex items-center text-sm text-muted-foreground'>
                    <Calendar className='w-4 h-4 mr-2 text-primary' />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className='flex items-center text-sm text-muted-foreground'>
                    <MapPin className='w-4 h-4 mr-2 text-primary' />
                    <span>{event.location}</span>
                  </div>
                  <div className='flex items-center text-sm text-muted-foreground'>
                    <Zap className='w-4 h-4 mr-2 text-primary' />
                    <span>{event.package}</span>
                  </div>
                </div>

                {/* Event Highlights */}
                {event.highlights && event.highlights.length > 0 && (
                  <div className='mb-4'>
                    <h4 className='font-medium text-sm mb-2'>Highlights:</h4>
                    <ul className='text-xs text-muted-foreground space-y-1'>
                      {event.highlights.slice(0, 3).map((highlight, index) => (
                        <li key={index} className='flex items-start'>
                          <span className='w-1 h-1 bg-primary rounded-full mt-1.5 mr-2 flex-shrink-0'></span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                      {event.highlights.length > 3 && (
                        <li className='text-xs italic'>
                          +{event.highlights.length - 3} more highlights
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Footer */}
                <div className='flex items-center justify-between pt-4 border-t border-border'>
                  <span className='text-xs text-muted-foreground'>
                    {event.eventType}
                  </span>
                  <div className='flex items-center text-xs text-primary'>
                    <Clock className='w-3 h-3 mr-1' />
                    <span>View Details</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {events.length > 6 && (
          <div className='text-center mt-12'>
            <button className='bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-3 rounded-lg font-semibold transition-colors'>
              View All Events ({events.length})
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
