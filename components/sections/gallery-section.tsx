'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Play, ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface GalleryItem {
  _id: string
  url: string
  caption: string
  eventType: string
  location: string
  date: string
}

export default function GallerySection() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/gallery')
      const data = await response.json()

      if (data.success) {
        setGallery(data.data)
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get unique event types for filter
  const eventTypes = ['all', ...new Set(gallery.map((item) => item.eventType))]

  // Filter items based on selected filter
  const filteredItems =
    filter === 'all'
      ? gallery
      : gallery.filter((item) => item.eventType === filter)

  const openLightbox = (item: GalleryItem) => {
    setSelectedItem(item)
  }

  const closeLightbox = () => {
    setSelectedItem(null)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!selectedItem) return

    const currentIndex = filteredItems.findIndex(
      (item) => item._id === selectedItem._id,
    )
    let newIndex

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1
    } else {
      newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0
    }

    setSelectedItem(filteredItems[newIndex])
  }

  if (isLoading) {
    return (
      <section id='gallery' className='py-20 bg-muted/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              Event <span className='text-gradient'>Gallery</span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Relive the magic through our lens. See how we bring events to life
              with professional sound and lighting.
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className='bg-card rounded-xl overflow-hidden border animate-pulse'
              >
                <div className='aspect-video bg-muted'></div>
                <div className='p-4'>
                  <div className='h-4 bg-muted rounded w-3/4 mb-2'></div>
                  <div className='h-3 bg-muted rounded w-1/2'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (gallery.length === 0) {
    return (
      <section id='gallery' className='py-20 bg-muted/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
              Event <span className='text-gradient'>Gallery</span>
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              We're building our portfolio one event at a time. Check back soon
              for amazing event photos!
            </p>
          </div>

          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <ImageIcon className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Gallery Coming Soon</h3>
            <p className='text-muted-foreground'>
              We're capturing amazing moments at every event we service.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='gallery' className='py-20 bg-muted/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            Event <span className='text-gradient'>Gallery</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Relive the magic through our lens. See how we bring events to life
            with professional sound and lighting.
          </p>
        </div>

        {/* Filter Buttons */}
        {eventTypes.length > 2 && (
          <div className='flex justify-center mb-12'>
            <div className='bg-card rounded-full p-1 border'>
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === type
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {type === 'all' ? 'All Events' : type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className='group relative bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300 cursor-pointer'
              onClick={() => openLightbox(item)}
            >
              {/* Image */}
              <div className='aspect-video relative overflow-hidden'>
                <Image
                  src={item.url}
                  alt={item.caption}
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-300'
                />

                {/* Overlay */}
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center'>
                  <Play className='w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </div>

                {/* Event Type Badge */}
                <div className='absolute top-3 left-3'>
                  <span className='bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium'>
                    {item.eventType}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className='p-4'>
                <h3 className='font-semibold mb-2 line-clamp-2'>
                  {item.caption}
                </h3>
                <div className='flex items-center justify-between text-sm text-muted-foreground'>
                  <span>{item.location}</span>
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show more button if there are many items */}
        {filteredItems.length === 0 && filter !== 'all' && (
          <div className='text-center mt-12'>
            <p className='text-muted-foreground mb-4'>
              No {filter} events found in our gallery yet.
            </p>
            <button
              onClick={() => setFilter('all')}
              className='bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors'
            >
              View All Events
            </button>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedItem && (
          <div
            className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'
            onClick={closeLightbox}
          >
            <div className='relative max-w-6xl w-full max-h-full flex items-center justify-center'>
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className='absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors'
              >
                <X className='w-6 h-6' />
              </button>

              {/* Navigation Buttons */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateLightbox('prev')
                    }}
                    className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10'
                  >
                    <ChevronLeft className='w-6 h-6' />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateLightbox('next')
                    }}
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10'
                  >
                    <ChevronRight className='w-6 h-6' />
                  </button>
                </>
              )}

              {/* Image Container */}
              <div
                className='relative max-w-full max-h-full'
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.caption}
                  width={1200}
                  height={800}
                  className='max-w-full max-h-[80vh] object-contain rounded-lg'
                />

                {/* Image Info */}
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white'>
                  <h3 className='text-xl font-semibold mb-2'>
                    {selectedItem.caption}
                  </h3>
                  <div className='flex items-center justify-between text-sm opacity-90'>
                    <span>
                      {selectedItem.eventType} • {selectedItem.location}
                    </span>
                    <span>
                      {new Date(selectedItem.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Image Counter */}
              {filteredItems.length > 1 && (
                <div className='absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
                  {filteredItems.findIndex(
                    (item) => item._id === selectedItem._id,
                  ) + 1}{' '}
                  of {filteredItems.length}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
