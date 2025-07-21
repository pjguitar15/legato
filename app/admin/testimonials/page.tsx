'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Star, User } from 'lucide-react'
import AuthGuard from '@/components/admin/auth-guard'
import Image from 'next/image'
import ImageUpload from '@/components/ui/image-upload'
import ClientGuard from '@/components/admin/client-guard'

interface Testimonial {
  _id: string
  name: string
  event: string
  date: string
  rating: number
  feedback: string
  location: string
  image?: string
}

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    event: '',
    rating: 5,
    feedback: '',
    location: '',
    date: '',
    image: '',
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/testimonials')
      const data = await response.json()

      if (data.success) {
        setTestimonials(data.data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const method = editingTestimonial ? 'PUT' : 'POST'
      const url = editingTestimonial
        ? `/api/admin/testimonials/${editingTestimonial._id}`
        : '/api/admin/testimonials'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        await fetchTestimonials() // Refresh the list
        setShowForm(false)
        resetForm()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving testimonial:', error)
      alert('Failed to save testimonial')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      event: testimonial.event,
      rating: testimonial.rating,
      feedback: testimonial.feedback,
      location: testimonial.location,
      date: testimonial.date,
      image: testimonial.image || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchTestimonials() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      alert('Failed to delete testimonial')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      event: '',
      rating: 5,
      feedback: '',
      location: '',
      date: '',
      image: '',
    })
    setEditingTestimonial(null)
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-display font-bold'>Testimonials</h1>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className='bg-card rounded-xl p-6 border animate-pulse'
              >
                <div className='flex items-start space-x-3 mb-4'>
                  <div className='w-12 h-12 bg-muted rounded-full'></div>
                  <div className='flex-1'>
                    <div className='h-4 bg-muted rounded w-24 mb-2'></div>
                    <div className='h-3 bg-muted rounded w-20 mb-1'></div>
                    <div className='h-3 bg-muted rounded w-16'></div>
                  </div>
                </div>
                <div className='h-3 bg-muted rounded w-full mb-2'></div>
                <div className='h-3 bg-muted rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-muted rounded w-1/2'></div>
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
            <h1 className='text-3xl font-display font-bold'>Testimonials</h1>
            <p className='text-muted-foreground'>
              Manage customer feedback and reviews
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className='bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2'
          >
            <Plus className='w-4 h-4' />
            <span>Add Testimonial</span>
          </button>
        </div>

        {/* Testimonials Grid */}
        {testimonials.length === 0 ? (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <Star className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>
              No testimonials found
            </h3>
            <p className='text-muted-foreground mb-4'>
              Start building credibility by adding your first customer
              testimonial.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
            >
              Add First Testimonial
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {testimonials.map((testimonial) => (
              <div
                key={testimonial._id}
                className='bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center space-x-3'>
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className='w-12 h-12 rounded-full object-cover border-2 border-primary'
                      />
                    ) : (
                      <div className='w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-primary'>
                        <User className='w-6 h-6 text-muted-foreground' />
                      </div>
                    )}
                    <div>
                      <h3 className='font-semibold'>{testimonial.name}</h3>
                      <p className='text-sm text-primary'>
                        {testimonial.event}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className='p-2 hover:bg-accent rounded-lg transition-colors'
                      title='Edit Testimonial'
                    >
                      <Edit className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className='p-2 hover:bg-accent rounded-lg transition-colors text-red-500'
                      title='Delete Testimonial'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                {/* Rating */}
                <div className='flex mb-3'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 text-yellow-400 fill-current'
                    />
                  ))}
                  <span className='ml-2 text-sm text-muted-foreground'>
                    {testimonial.rating}/5
                  </span>
                </div>

                {/* Feedback */}
                <p className='text-muted-foreground text-sm leading-relaxed mb-4'>
                  &ldquo;{testimonial.feedback}&rdquo;
                </p>

                {/* Date */}
                <div className='text-xs text-muted-foreground'>
                  {new Date(testimonial.date).toLocaleDateString()}
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
            <div className='relative bg-card border border-border rounded-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden'>
              <div className='p-6 border-b border-border bg-card'>
                <h3 className='text-xl font-display font-bold'>
                  {editingTestimonial
                    ? 'Edit Testimonial'
                    : 'Add New Testimonial'}
                </h3>
              </div>

              <div className='overflow-y-auto max-h-[calc(90vh-120px)]'>
                <form onSubmit={handleSubmit} className='p-6 space-y-4 bg-card'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Customer Name
                      </label>
                      <input
                        type='text'
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='e.g., Maria Santos'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Event Type
                      </label>
                      <input
                        type='text'
                        value={formData.event}
                        onChange={(e) =>
                          setFormData({ ...formData, event: e.target.value })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='e.g., Wedding Reception'
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Rating
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: parseInt(e.target.value),
                        })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} Star{rating > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Feedback
                    </label>
                    <textarea
                      value={formData.feedback}
                      onChange={(e) =>
                        setFormData({ ...formData, feedback: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      rows={4}
                      placeholder="Customer's feedback about your service..."
                      required
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                        placeholder='e.g., Tagaytay, Cavite'
                        required
                      />
                    </div>

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
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Customer Photo (Optional)
                    </label>
                    <ClientGuard>
                      <ImageUpload
                        value={formData.image}
                        onChange={(url) =>
                          setFormData({ ...formData, image: url || '' })
                        }
                        disabled={isSubmitting}
                        placeholder='Upload customer photo'
                      />
                    </ClientGuard>
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
                        ? editingTestimonial
                          ? 'Updating...'
                          : 'Adding...'
                        : editingTestimonial
                        ? 'Update Testimonial'
                        : 'Add Testimonial'}
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
