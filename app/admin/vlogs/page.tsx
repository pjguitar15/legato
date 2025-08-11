'use client'

import { useEffect, useState } from 'react'
import AuthGuard from '@/components/admin/auth-guard'

type Vlog = { _id?: string; url: string; youtubeId: string; title?: string }

function extractId(url: string): string {
  try {
    const m = url.match(/v=([^&]+)/)
    return (m?.[1] || '').trim()
  } catch {
    return ''
  }
}

export default function AdminVlogsPage() {
  const [vlogs, setVlogs] = useState<Vlog[]>([])
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/vlogs')
      const json = await res.json()
      if (json.success) setVlogs(json.data)
      setIsLoading(false)
    })()
  }, [])

  const addVlog = async (e: React.FormEvent) => {
    e.preventDefault()
    const youtubeId = extractId(url)
    if (!youtubeId) return alert('Invalid YouTube URL')
    const res = await fetch('/api/admin/vlogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, youtubeId, title }),
    })
    const json = await res.json()
    if (json.success) {
      setVlogs([json.data, ...vlogs])
      setUrl('')
      setTitle('')
    } else {
      alert(json.message || 'Failed to add')
    }
  }

  return (
    <AuthGuard>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-display font-bold'>
            Vlogs (YouTube Links)
          </h1>
        </div>

        <form
          onSubmit={addVlog}
          className='bg-card border border-border rounded-xl p-4 space-y-3'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <input
              className='px-3 py-2 bg-background border border-border rounded-lg'
              placeholder='YouTube URL (e.g. https://www.youtube.com/watch?v=...)'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <input
              className='px-3 py-2 bg-background border border-border rounded-lg'
              placeholder='Optional title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <button className='px-4 py-2 bg-[hsl(var(--primary))] text-primary-foreground rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors'>
            Add Link
          </button>
        </form>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {isLoading ? (
            <div>Loading…</div>
          ) : (
            vlogs.map((v) => (
              <div
                key={v._id}
                className='rounded-xl border border-border bg-card overflow-hidden'
              >
                <div className='aspect-video bg-muted'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                    alt={v.title || v.youtubeId}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='p-3'>
                  <div className='font-semibold'>
                    {v.title || 'YouTube Video'}
                  </div>
                  <div className='text-xs text-muted-foreground break-all'>
                    {v.url}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
