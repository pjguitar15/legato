'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook } from 'lucide-react'
import { useCompanyData } from '@/hooks/use-company-data'

export default function ContactPage() {
  const { companyData } = useCompanyData()
  const [gallery, setGallery] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/gallery')
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setGallery(json.data.slice(0, 6).map((g: any) => g.image))
        }
      } catch {}
    })()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/feedback/' + crypto.randomUUID(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error('Failed')
      setStatus('sent')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus('error')
    }
  }

  const fbLink =
    (companyData as any)?.socialMedia?.facebook ||
    (companyData as any)?.contact?.facebook ||
    (companyData as any)?.contact?.messenger

  return (
    <section className='pt-24 pb-16 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Hero Row */}
        <div className='mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center'>
          <div className='lg:col-span-2'>
            <h1 className='text-4xl sm:text-5xl font-display font-bold mb-3'>
              Let’s talk about your{' '}
              <span className='bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent'>
                next event
              </span>
            </h1>
            <p className='text-muted-foreground'>
              We’ll reply within 24 hours. For urgent concerns, message us on
              Facebook.
            </p>
          </div>
          {fbLink && (
            <a
              href={fbLink}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center justify-center px-6 py-4 rounded-xl border bg-card hover:bg-accent transition-colors'
            >
              <Facebook className='w-5 h-5 mr-2' /> Visit Facebook Page
            </a>
          )}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-start'>
          {/* Left: Contact form */}
          <div className='bg-card border border-border rounded-2xl p-6 shadow-sm'>
            <h1 className='text-3xl font-display font-bold mb-2'>Contact Us</h1>
            <p className='text-muted-foreground mb-6'>
              Send us a message and we’ll get back within a day.
            </p>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <input
                  className='px-3 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  placeholder='Your name'
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  className='px-3 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  placeholder='Email address'
                  type='email'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <input
                className='w-full px-3 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                placeholder='Phone (optional)'
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <textarea
                className='w-full px-3 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                placeholder='Tell us about your event...'
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
              <button
                type='submit'
                disabled={status === 'sending'}
                className='bg-[hsl(var(--primary))] text-primary-foreground px-6 py-3 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors disabled:opacity-50'
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
              {status === 'sent' && (
                <div className='text-green-500 text-sm'>Message sent!</div>
              )}
              {status === 'error' && (
                <div className='text-red-500 text-sm'>Failed to send.</div>
              )}
            </form>
            <div className='mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <MapPin className='w-4 h-4 text-primary' />
                <span>
                  {companyData?.contact?.city}, {companyData?.contact?.province}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='w-4 h-4 text-primary' />
                <span>{companyData?.contact?.phone}</span>
              </div>
              {fbLink && (
                <a
                  href={fbLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 hover:text-primary'
                >
                  <Facebook className='w-4 h-4 text-primary' /> Facebook Page
                </a>
              )}
            </div>
          </div>

          {/* Right: Gallery/visual */}
          <div>
            <div className='grid grid-cols-3 gap-3'>
              {gallery.length > 0 ? (
                gallery.map((src, i) => (
                  <div
                    key={i}
                    className='relative aspect-square rounded-xl overflow-hidden border border-border'
                  >
                    <Image
                      src={src || '/placeholder.jpg'}
                      alt='gallery'
                      fill
                      className='object-cover'
                    />
                  </div>
                ))
              ) : (
                <div className='text-muted-foreground'>Photos coming soon…</div>
              )}
            </div>

            {/* Stats / why us */}
            <div className='mt-8 grid grid-cols-3 gap-3 text-center'>
              {[
                { label: 'Live Shows', value: '500+' },
                { label: 'Years of Service', value: '3+' },
                { label: 'Rating', value: '5.0⭐' },
              ].map((s) => (
                <div
                  key={s.label}
                  className='rounded-xl border border-border p-4'
                >
                  <div className='text-2xl font-bold'>{s.value}</div>
                  <div className='text-xs text-muted-foreground'>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
