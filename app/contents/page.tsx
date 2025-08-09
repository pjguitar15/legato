'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function ContentsPage() {
  const placeholders = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: `Legato Vlog #${i + 1}`,
    thumb: `/placeholder.jpg`,
    url: '#',
  }))

  return (
    <section className='pt-24 pb-16 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h1 className='text-3xl font-bold mb-6'>Contents</h1>
        <p className='text-muted-foreground mb-8'>
          Our YouTube vlogs and behind-the-scenes. (Placeholder)
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {placeholders.map((v) => (
            <Link
              key={v.id}
              href={v.url}
              className='group rounded-xl border border-border overflow-hidden hover:shadow-lg transition'
            >
              <div className='relative aspect-video w-full'>
                <Image
                  src={v.thumb}
                  alt={v.title}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-3'>
                <div className='font-semibold group-hover:text-primary'>
                  {v.title}
                </div>
                <div className='text-xs text-muted-foreground'>
                  YouTube • Coming soon
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
