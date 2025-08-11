'use client'

import { useEffect, useMemo, useState } from 'react'
import MainLayout from '@/app/(main)/layout'
import { PlayCircle, Youtube, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCompanyData } from '@/hooks/use-company-data'

type Vlog = { _id: string; url: string; youtubeId: string; title?: string }

export default function VlogsPage() {
  const [vlogs, setVlogs] = useState<Vlog[]>([])
  const [active, setActive] = useState<Vlog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { companyData } = useCompanyData()

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/vlogs')
        const json = await res.json()
        if (json.success) setVlogs(json.data)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!active) return
      if (e.key === 'Escape') setActive(null)
      if (
        vlogs.length > 0 &&
        (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
      ) {
        const idx = vlogs.findIndex((v) => v._id === active._id)
        if (idx < 0) return
        const next =
          e.key === 'ArrowRight'
            ? (idx + 1) % vlogs.length
            : (idx - 1 + vlogs.length) % vlogs.length
        setActive(vlogs[next])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, vlogs])

  const youtubeChannel = useMemo(
    () => companyData?.socialMedia?.youtube,
    [companyData],
  )

  return (
    <MainLayout>
      <section className='pt-24 pb-16 min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-end justify-between gap-4 mb-6'>
            <div>
              <h1 className='text-3xl font-bold'>Vlogs</h1>
              <p className='text-muted-foreground'>
                Backstage mixes, stage setups, and gig recaps —
                <span className='mx-1 bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent font-semibold'>
                  watch instantly in‑page
                </span>
                by tapping any thumbnail.
              </p>
              <div className='mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground'>
                <span className='inline-flex items-center gap-1 rounded-full border px-2 py-1'>
                  <PlayCircle className='w-3 h-3' /> In‑page player
                </span>
                <span className='inline-flex items-center gap-1 rounded-full border px-2 py-1'>
                  <Youtube className='w-3 h-3' /> YouTube
                </span>
              </div>
            </div>
            {youtubeChannel && (
              <a
                href={youtubeChannel}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:border-primary hover:text-primary transition-colors cursor-pointer'
              >
                <Youtube className='w-4 h-4' /> Visit Channel
              </a>
            )}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className='rounded-2xl border border-border bg-card overflow-hidden animate-pulse'
                  >
                    <div className='aspect-video bg-muted' />
                    <div className='p-3 h-14' />
                  </div>
                ))
              : vlogs.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => setActive(v)}
                    className='group rounded-2xl border border-border overflow-hidden hover:shadow-xl transition text-left cursor-pointer bg-card'
                  >
                    <div className='relative aspect-video w-full bg-muted'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                        alt={v.title || v.youtubeId}
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity' />
                      <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                        <PlayCircle className='w-16 h-16 text-white drop-shadow-lg' />
                      </div>
                    </div>
                    <div className='p-3'>
                      <div className='font-semibold group-hover:text-primary line-clamp-1'>
                        {v.title || 'YouTube Video'}
                      </div>
                      <div className='mt-1 text-xs text-muted-foreground inline-flex items-center gap-1'>
                        <Youtube className='w-3 h-3' /> YouTube
                      </div>
                    </div>
                  </button>
                ))}
          </div>

          {/* Modal */}
          {active && (
            <div
              className='fixed inset-0 z-50 flex items-center justify-center'
              onClick={() => setActive(null)}
            >
              <div className='absolute inset-0 bg-black/80 z-0 cursor-pointer' />
              <div
                className='relative z-10 w-[90vw] max-w-4xl aspect-video bg-black rounded-xl overflow-hidden border border-border shadow-2xl'
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  allow='autoplay; encrypted-media; picture-in-picture'
                  allowFullScreen
                  title={active.title || active.youtubeId}
                  className='w-full h-full'
                />
                <button
                  onClick={() => setActive(null)}
                  className='absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded px-3 py-1 text-sm cursor-pointer inline-flex items-center gap-1'
                  aria-label='Close'
                >
                  <X className='w-4 h-4' /> Close
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!active) return
                  const idx = vlogs.findIndex((v) => v._id === active._id)
                  setActive(vlogs[(idx - 1 + vlogs.length) % vlogs.length])
                }}
                className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 cursor-pointer'
                aria-label='Previous'
              >
                <ChevronLeft className='w-5 h-5' />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!active) return
                  const idx = vlogs.findIndex((v) => v._id === active._id)
                  setActive(vlogs[(idx + 1) % vlogs.length])
                }}
                className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 cursor-pointer'
                aria-label='Next'
              >
                <ChevronRight className='w-5 h-5' />
              </button>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  )
}
