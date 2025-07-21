'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import galleryData from '@/data/gallery.json'
import Image from 'next/image'

interface GalleryItem {
  id: number
  url: string
  caption: string
  eventType: string
  location: string
  date: string
}

export default function GallerySection() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filteredItems =
    filter === 'all'
      ? galleryData.images
      : galleryData.images.filter(
          (item) => item.eventType.toLowerCase() === filter,
        )

  const nextItem = () => {
    if (!selectedItem) return
    const currentIndex = filteredItems.findIndex(
      (item) => item.id === selectedItem.id,
    )
    const nextIndex = (currentIndex + 1) % filteredItems.length
    setSelectedItem(filteredItems[nextIndex])
  }

  const prevItem = () => {
    if (!selectedItem) return
    const currentIndex = filteredItems.findIndex(
      (item) => item.id === selectedItem.id,
    )
    const prevIndex =
      (currentIndex - 1 + filteredItems.length) % filteredItems.length
    setSelectedItem(filteredItems[prevIndex])
  }

  return (
    <section id='gallery' className='py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-display font-bold mb-6'>
            Our <span className='text-gradient'>Gallery</span>
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Experience the energy of our live events through photos and videos
            from rock concerts and performances we&apos;ve powered.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className='flex justify-center mb-12'>
          <div className='flex space-x-4 bg-secondary/50 rounded-xl p-2'>
            {['all', 'wedding', 'concert', 'corporate'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 capitalize ${
                  filter === filterType
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {filterType === 'all' ? 'All Events' : filterType}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className='relative group cursor-pointer overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300'
              onClick={() => setSelectedItem(item)}
            >
              {/* Thumbnail */}
              <div className='aspect-video relative overflow-hidden'>
                <Image
                  src={item.url || '/placeholder.svg'}
                  alt={item.caption}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-500'
                />

                {/* Video Play Button - Placeholder for future video items */}
                {item.eventType === 'Concert' && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='bg-black/50 rounded-full p-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300'>
                      <Play className='w-8 h-8 text-white fill-current' />
                    </div>
                  </div>
                )}

                {/* Overlay */}
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300' />
              </div>

              {/* Content */}
              <div className='p-6'>
                <h3 className='text-lg font-bold mb-2 group-hover:text-primary transition-colors'>
                  {item.caption}
                </h3>
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <span>{item.eventType}</span>
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'>
            <div className='relative max-w-6xl w-full'>
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className='absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10'
              >
                <X className='w-6 h-6' />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={prevItem}
                className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>

              <button
                onClick={nextItem}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10'
              >
                <ChevronRight className='w-6 h-6' />
              </button>

              {/* Media Content */}
              <div className='relative'>
                <Image
                  src={selectedItem.url || '/placeholder.svg'}
                  alt={selectedItem.caption}
                  width={1200}
                  height={800}
                  className='w-full h-auto max-h-[80vh] object-contain rounded-lg'
                />

                {/* Media Info */}
                <div className='absolute bottom-0 left-0 right-0 bg-black/70 text-white p-6 rounded-b-lg'>
                  <h3 className='text-2xl font-bold mb-2'>
                    {selectedItem.caption}
                  </h3>
                  <div className='flex items-center justify-between text-sm text-gray-400'>
                    <span>Event: {selectedItem.eventType}</span>
                    <span>Location: {selectedItem.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className='mt-16 text-center bg-secondary/30 rounded-3xl p-8'>
          <h3 className='text-2xl font-bold mb-4'>
            Want to See Your Event Here?
          </h3>
          <p className='text-muted-foreground mb-6'>
            Let us capture the energy of your next rock performance with
            professional sound and lighting that makes every moment legendary.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors'>
              Book Your Show
            </button>
            <button className='bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors'>
              View More Events
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
