'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Mail,
  MessageSquareText,
  Send,
  MessageCircle,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

type Pkg = {
  _id: string
  name: string
  description: string
}

type GalleryItem = {
  _id: string
  url: string
  caption: string
  eventType: string
  location: string
  date: string
}

export default function PackageDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [pkg, setPkg] = useState<Pkg | null>(null)
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [equipmentNames, setEquipmentNames] = useState<string[]>([])
  const formRef = useRef<HTMLFormElement | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewText, setPreviewText] = useState('')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventVenue, setEventVenue] = useState('')
  const [eventGuests, setEventGuests] = useState('')
  const [eventNotes, setEventNotes] = useState('')

  const defaultMessage = useMemo(() => {
    const name = pkg?.name ?? 'Package'
    return `Hello Legato team,\n\nI would like to inquire about booking the ${name}.\n\nEvent details:\n- Date: ${
      eventDate || '[Your target date]'
    }\n- Venue/Location: ${eventVenue || '[Your venue]'}\n- Estimated guests: ${
      eventGuests || '[Headcount]'
    }\n- Notes: ${
      eventNotes || '[Anything else]'
    }\n\nPlease let me know availability and the next steps. Thank you!`
  }, [pkg?.name, eventDate, eventVenue, eventGuests, eventNotes])

  useEffect(() => {
    if (!params?.id) return
    ;(async () => {
      const res = await fetch(`/api/admin/packages/${params.id}`)
      const json = await res.json()
      if (json.success) {
        setPkg(json.data)
        setEquipmentNames(json.data?.equipment || [])
      }
    })()
    ;(async () => {
      const pkgName = encodeURIComponent(
        String((await (async () => pkg)())?.name ?? ''),
      )
      // fetch recent events filtered by current package name; fallback to all if not yet loaded
      const res = await fetch(`/api/events?package=${pkgName}`)
      const json = await res.json()
      if (json.success)
        setGallery(
          json.data.map((ev: any) => ({
            _id: ev._id,
            url: ev.image || '/placeholder.jpg',
            caption: ev.title,
            eventType: ev.eventType,
            location: ev.location,
            date: ev.date,
          })),
        )
    })()
  }, [params?.id])

  async function handleSendEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      setIsSending(true)
      const emailjs = (await import('@emailjs/browser')).default
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
      if (!serviceId || !templateId || !publicKey) {
        alert(
          'EmailJS is not configured yet. Please add your EmailJS env vars.',
        )
        return
      }
      if (!formRef.current) return
      await emailjs.sendForm(serviceId, templateId, formRef.current, {
        publicKey,
      })
      const { toast } = await import('sonner')
      toast.success('Message sent! We will get back to you shortly.')
      formRef.current.reset()
    } catch (err) {
      console.error('Email send failed', err)
      const { toast } = await import('sonner')
      toast.error('Failed to send email. Please try again later.')
    }
    setIsSending(false)
  }

  return (
    <section className='pt-24 pb-16 min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-6 flex items-center justify-between'>
          <button
            onClick={() => router.back()}
            className='inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary transition-colors'
          >
            ← Back
          </button>
          <Link
            href='/packages'
            className='text-sm text-muted-foreground hover:text-foreground'
          >
            All packages
          </Link>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
          {/* Left: sticky package equipment list */}
          <div className='lg:sticky lg:top-24 h-fit'>
            <h1 className='text-2xl sm:text-3xl font-bold mb-3'>
              Package: {pkg?.name}
            </h1>
            <p className='text-sm text-muted-foreground mb-5'>
              What you get with this package
            </p>
            <div className='space-y-3'>
              {equipmentNames.map((name, idx) => (
                <div
                  key={idx}
                  className='group relative overflow-hidden rounded-xl border border-border bg-card p-4 hover:shadow-lg transition'
                >
                  <div className='flex items-center gap-3'>
                    <div className='h-12 w-12 rounded-lg bg-muted/60 flex items-center justify-center text-xs font-medium'>
                      {name.split(' ').slice(0, 2).join(' ')}
                    </div>
                    <div>
                      <div className='font-semibold'>{name}</div>
                      <div className='text-xs text-muted-foreground'>
                        Included • Qty varies per venue
                      </div>
                    </div>
                  </div>
                  <div className='absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent to-black/5' />
                </div>
              ))}
              {equipmentNames.length === 0 && (
                <div className='text-sm text-muted-foreground'>
                  Equipment details to follow for this package.
                </div>
              )}
            </div>
          </div>

          {/* Right: sticky email-first contact panel */}
          <div className='lg:sticky lg:top-24 h-fit'>
            <form
              ref={formRef}
              onSubmit={handleSendEmail}
              className='rounded-2xl border border-border bg-card p-6 shadow-sm'
            >
              <h2 className='text-3xl font-bold mb-1'>
                Tell us about your event
              </h2>
              <p className='text-sm text-muted-foreground mb-6'>
                You're booking:{' '}
                <span className='font-semibold'>{pkg?.name ?? 'Package'}</span>.
                Fill in the details and we’ll pre‑compose the email for you.
              </p>

              {/* Hidden fields for EmailJS template */}
              <input
                type='hidden'
                name='subject'
                value={`Booking inquiry - ${pkg?.name ?? 'Package'}`}
              />
              <input type='hidden' name='package' value={pkg?.name ?? ''} />
              <input
                type='hidden'
                name='to_email'
                value='legatosoundsandlights@gmail.com'
              />
              <input type='hidden' name='from_email' value={userEmail} />
              <input type='hidden' name='reply_to' value={userEmail} />

              {/* Email is primary */}
              <div className='space-y-3 mb-5'>
                <input
                  name='user_name'
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  type='text'
                  placeholder='Your name'
                  className='w-full rounded-md border bg-background px-3 py-2 text-sm'
                />
                <input
                  name='user_email'
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  type='email'
                  placeholder='Email address'
                  className='w-full rounded-md border bg-background px-3 py-2 text-sm'
                />
                <input
                  name='user_phone'
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  type='tel'
                  placeholder='Phone (optional)'
                  className='w-full rounded-md border bg-background px-3 py-2 text-sm'
                />

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <input
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    type='date'
                    placeholder='Event date'
                    className='w-full rounded-md border bg-background px-3 py-2 text-sm'
                  />
                  <input
                    value={eventGuests}
                    onChange={(e) => setEventGuests(e.target.value)}
                    type='number'
                    min='1'
                    placeholder='Estimated guests'
                    className='w-full rounded-md border bg-background px-3 py-2 text-sm'
                  />
                </div>
                <input
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  type='text'
                  placeholder='Venue / Location'
                  className='w-full rounded-md border bg-background px-3 py-2 text-sm'
                />
                <textarea
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                  rows={6}
                  placeholder='Notes (optional)'
                  className='w-full rounded-md border bg-background px-3 py-2 text-sm'
                />

                {/* Hidden field that will be filled from preview text */}
                <input
                  type='hidden'
                  name='message'
                  value={previewText || defaultMessage}
                />

                <button
                  type='button'
                  onClick={() => {
                    setPreviewText(defaultMessage)
                    setIsPreviewOpen(true)
                  }}
                  disabled={isSending}
                  className='w-full rounded-lg bg-[hsl(var(--primary))] px-6 py-3 font-semibold text-primary-foreground transition hover:bg-[hsl(var(--primary))]/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  Review Email
                </button>
              </div>

              {/* Other contact options below */}
              <div className='pt-4 border-t'>
                <p className='text-xs text-muted-foreground mb-2'>
                  Other options
                </p>
                <div className='grid grid-cols-2 gap-3'>
                  <a className='flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary'>
                    <MessageCircle className='h-4 w-4' /> Messenger
                  </a>
                  <a className='flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary'>
                    <Send className='h-4 w-4' /> Telegram
                  </a>
                  <a className='flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary'>
                    <Mail className='h-4 w-4' /> Email
                  </a>
                  <a className='flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary'>
                    <MessageSquareText className='h-4 w-4' /> SMS
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Clients slider below */}
        <div className='mt-10'>
          <h3 className='text-lg font-semibold mb-3'>
            Clients who booked {pkg?.name}
          </h3>
          <div className='marquee border border-border rounded-xl'>
            <div className='marquee-track p-4'>
              {[...gallery, ...gallery].map((item, i) => (
                <div
                  key={item._id + '_' + i}
                  className='relative h-44 w-[22rem] sm:h-56 sm:w-[28rem] flex-shrink-0 overflow-hidden rounded-xl border border-border bg-black'
                >
                  <Image
                    src={item.url}
                    alt={item.caption}
                    fill
                    className='object-cover opacity-95'
                  />
                  <div className='absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm'>
                    {item.location}
                  </div>
                  <div className='absolute inset-x-0 bottom-0 p-3'>
                    <div className='rounded-lg bg-gradient-to-t from-black/80 to-black/10 p-3 text-white'>
                      <div className='flex items-center justify-between text-[11px] opacity-90'>
                        <span>{item.date}</span>
                        <span className='rounded-full bg-white/15 px-2 py-0.5 uppercase tracking-wide'>
                          {item.eventType}
                        </span>
                      </div>
                      <div className='mt-1 line-clamp-1 text-sm font-semibold'>
                        {item.caption}
                      </div>
                      <div className='mt-0.5 text-[12px] opacity-90'>
                        Legato Sounds & Lights
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Preview Modal */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className='sm:max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Preview email</DialogTitle>
            </DialogHeader>
            <div className='space-y-3'>
              <div className='text-sm text-muted-foreground'>
                To: legatosoundsandlights@gmail.com
              </div>
              <div className='text-sm text-muted-foreground'>
                From: {userEmail || 'you@example.com'}
              </div>
              <div className='rounded-md border bg-background p-2'>
                <textarea
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  rows={12}
                  className='w-full resize-y bg-transparent outline-none'
                />
              </div>
              <div className='text-xs text-muted-foreground'>
                Package: {pkg?.name}
              </div>
            </div>
            <DialogFooter>
              <button
                type='button'
                onClick={() => setIsPreviewOpen(false)}
                className='rounded-md border px-4 py-2 text-sm hover:bg-muted'
              >
                Edit form
              </button>
              <button
                type='submit'
                form='' /* we will submit the main form via ref */
                onClick={async () => {
                  if (formRef.current) {
                    // ensure hidden field has the latest preview text
                    const hidden = formRef.current.querySelector(
                      'input[name="message"]',
                    ) as HTMLInputElement | null
                    if (hidden) hidden.value = previewText
                    await handleSendEmail(new Event('submit') as any)
                    setIsPreviewOpen(false)
                  }
                }}
                className='inline-flex items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-[hsl(var(--primary))]/90'
              >
                {isSending && <Loader2 className='h-4 w-4 animate-spin' />}
                {isSending ? 'Sending…' : 'Send email'}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
