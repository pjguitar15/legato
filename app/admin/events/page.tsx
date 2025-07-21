'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react'
import AuthGuard from '@/components/admin/auth-guard'
import Image from 'next/image'
import ImageUpload from '@/components/ui/image-upload'
import ClientGuard from '@/components/admin/client-guard'

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

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    eventType: '',
    package: '',
    image: '',
    highlights: [''],
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const method = editingEvent ? 'PUT' : 'POST'
      const url = editingEvent
        ? `/api/admin/events/${editingEvent._id}`
        : '/api/admin/events'

      const payload = {
        ...formData,
        highlights: formData.highlights.filter((h) => h.trim() !== ''),
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        await fetchEvents() // Refresh the list
        setShowForm(false)
        resetForm()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Failed to save event')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      eventType: event.eventType,
      package: event.package,
      image: event.image || '',
      highlights: event.highlights?.length ? event.highlights : [''],
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchEvents() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      eventType: '',
      package: '',
      image: '',
      highlights: [''],
    })
    setEditingEvent(null)
  }

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] })
  }

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index),
    })
  }

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.highlights]
    newHighlights[index] = value
    setFormData({ ...formData, highlights: newHighlights })
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-display font-bold'>Events</h1>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className='bg-card rounded-xl p-6 border animate-pulse'
              >
                <div className='h-40 bg-muted rounded-lg mb-4'></div>
                <div className='h-5 bg-muted rounded w-3/4 mb-2'></div>
                <div className='h-4 bg-muted rounded w-full mb-2'></div>
                <div className='h-4 bg-muted rounded w-2/3'></div>
              </div>
            ))}
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-display font-bold'>Events</h1>
            <p className='text-muted-foreground'>
              Manage past and upcoming events
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className='bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2'
          >
            <Plus className='w-4 h-4' />
            <span>Add Event</span>
          </button>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <Calendar className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>No events found</h3>
            <p className='text-muted-foreground mb-4'>
              Start showcasing your work by adding your first event.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
            >
              Add First Event
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {events.map((event) => (
              <div
                key={event._id}
                className='bg-card rounded-xl border border-border hover:shadow-lg transition-shadow overflow-hidden'
              >
                {/* Event Image */}
                {event.image && (
                  <div className='relative h-48'>
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className='object-cover'
                    />
                  </div>
                )}

                <div className='p-6'>
                  {/* Header */}
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold mb-1'>
                        {event.title}
                      </h3>
                      <div className='flex items-center space-x-1 text-primary text-sm mb-1'>
                        <Calendar className='w-4 h-4' />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className='flex items-center space-x-1 text-muted-foreground text-sm'>
                        <MapPin className='w-4 h-4' />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => handleEdit(event)}
                        className='p-2 hover:bg-accent rounded-lg transition-colors'
                        title='Edit Event'
                      >
                        <Edit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className='p-2 hover:bg-accent rounded-lg transition-colors text-red-500'
                        title='Delete Event'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>

                  {/* Event Type & Package */}
                  <div className='flex space-x-2 mb-3'>
                    <span className='px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full'>
                      {event.eventType}
                    </span>
                    <span className='px-2 py-1 bg-primary/20 text-primary text-xs rounded-full'>
                      {event.package}
                    </span>
                  </div>

                  {/* Description */}
                  <p className='text-muted-foreground text-sm mb-4 line-clamp-3'>
                    {event.description}
                  </p>

                  {/* Highlights */}
                  {event.highlights && event.highlights.length > 0 && (
                    <div>
                      <h4 className='font-medium text-sm mb-2'>Highlights:</h4>
                      <ul className='text-xs text-muted-foreground space-y-1'>
                        {event.highlights
                          .slice(0, 3)
                          .map((highlight, index) => (
                            <li
                              key={index}
                              className='flex items-start space-x-2'
                            >
                              <span className='w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0'></span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        {event.highlights.length > 3 && (
                          <li className='text-xs italic'>
                            +{event.highlights.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            {/* Modal Backdrop */}
            <div
              className='absolute inset-0 bg-black/60 backdrop-blur-sm'
              onClick={() => {
                setShowForm(false)
                resetForm()
              }}
            />

            {/* Modal Content */}
            <div className='relative bg-card border border-border rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden'>
              <div className='p-6 border-b border-border bg-card'>
                <h3 className='text-xl font-display font-bold'>
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
              </div>

              <div className='overflow-y-auto max-h-[calc(90vh-120px)]'>
                <form onSubmit={handleSubmit} className='p-6 space-y-6 bg-card'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Event Title
                    </label>
                    <input
                      type='text'
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      placeholder='e.g., Rock Concert at SM Trece'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      rows={3}
                      placeholder='Describe the event and your services provided...'
                      required
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Date
                      </label>
                      <input
                        type='date'
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Location
                      </label>
                      <input
                        type='text'
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='e.g., SM City Trece Martires'
                        required
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Event Type
                      </label>
                      <input
                        type='text'
                        value={formData.eventType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eventType: e.target.value,
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='e.g., Concert, Wedding, Corporate'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Package Used
                      </label>
                      <input
                        type='text'
                        value={formData.package}
                        onChange={(e) =>
                          setFormData({ ...formData, package: e.target.value })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='e.g., Full Band Setup, Basic Setup'
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Event Photo (Optional)
                    </label>
                    <ClientGuard>
                      <ImageUpload
                        value={formData.image}
                        onChange={(url) =>
                          setFormData({ ...formData, image: url || '' })
                        }
                        disabled={isSubmitting}
                        placeholder='Upload event photo'
                      />
                    </ClientGuard>
                  </div>

                  {/* Highlights */}
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='block text-sm font-medium'>
                        Event Highlights (Optional)
                      </label>
                      <button
                        type='button'
                        onClick={addHighlight}
                        className='text-primary hover:text-primary/80 text-sm'
                      >
                        + Add Highlight
                      </button>
                    </div>
                    <div className='space-y-2'>
                      {formData.highlights.map((highlight, index) => (
                        <div key={index} className='flex space-x-2'>
                          <input
                            type='text'
                            value={highlight}
                            onChange={(e) =>
                              updateHighlight(index, e.target.value)
                            }
                            className='flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                            placeholder='e.g., 500+ audience capacity'
                          />
                          {formData.highlights.length > 1 && (
                            <button
                              type='button'
                              onClick={() => removeHighlight(index)}
                              className='px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='flex justify-end space-x-4 pt-4 border-t border-border'>
                    <button
                      type='button'
                      onClick={() => {
                        setShowForm(false)
                        resetForm()
                      }}
                      className='px-4 py-2 text-muted-foreground hover:text-foreground transition-colors'
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50'
                    >
                      {isSubmitting
                        ? editingEvent
                          ? 'Updating...'
                          : 'Adding...'
                        : editingEvent
                        ? 'Update Event'
                        : 'Add Event'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
