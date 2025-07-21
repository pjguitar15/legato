'use client'

import { useEffect, useState } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  MessageSquare,
  CheckCircle,
  Clock,
  Link,
  ExternalLink,
} from 'lucide-react'
import AuthGuard from '@/components/admin/auth-guard'

interface FeedbackReview {
  _id: string
  customerName: string
  eventType: string
  location: string
  date: string
  status: 'pending' | 'completed'
  rating?: number
  feedback?: string
  submittedAt?: string
  uniqueId: string
  createdAt: string
}

export default function FeedbackReviewsAdmin() {
  const [feedbackReviews, setFeedbackReviews] = useState<FeedbackReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<FeedbackReview | null>(
    null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customerName: '',
    eventType: '',
    location: '',
    date: '',
  })

  useEffect(() => {
    fetchFeedbackReviews()
  }, [])

  const fetchFeedbackReviews = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/feedback-reviews')
      const data = await response.json()

      if (data.success) {
        setFeedbackReviews(data.data)
      }
    } catch (error) {
      console.error('Error fetching feedback reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const method = editingReview ? 'PUT' : 'POST'
      const url = editingReview
        ? `/api/admin/feedback-reviews/${editingReview._id}`
        : '/api/admin/feedback-reviews'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        await fetchFeedbackReviews()
        setShowForm(false)
        resetForm()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving feedback review:', error)
      alert('Failed to save feedback review')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (review: FeedbackReview) => {
    setEditingReview(review)
    setFormData({
      customerName: review.customerName,
      eventType: review.eventType,
      location: review.location,
      date: review.date,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback review?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/feedback-reviews/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        await fetchFeedbackReviews()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting feedback review:', error)
      alert('Failed to delete feedback review')
    }
  }

  const resetForm = () => {
    setFormData({
      customerName: '',
      eventType: '',
      location: '',
      date: '',
    })
    setEditingReview(null)
  }

  const copyFeedbackLink = async (uniqueId: string) => {
    const link = `${window.location.origin}/feedback/${uniqueId}`

    try {
      await navigator.clipboard.writeText(link)
      setCopiedLink(uniqueId)

      // Reset the copied state after 3 seconds
      setTimeout(() => {
        setCopiedLink(null)
      }, 3000)
    } catch (error) {
      console.error('Failed to copy link:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = link
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)

      setCopiedLink(uniqueId)
      setTimeout(() => {
        setCopiedLink(null)
      }, 3000)
    }
  }

  const openFeedbackLink = (uniqueId: string) => {
    const link = `${window.location.origin}/feedback/${uniqueId}`
    window.open(link, '_blank')
  }

  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircle className='w-4 h-4 text-green-500' />
    }
    return <Clock className='w-4 h-4 text-yellow-500' />
  }

  const getStatusText = (status: string) => {
    if (status === 'completed') {
      return 'Completed'
    }
    return 'Pending'
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-display font-bold'>
              Feedback Reviews
            </h1>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className='bg-card rounded-xl p-6 border animate-pulse'
              >
                <div className='h-5 bg-muted rounded w-3/4 mb-4'></div>
                <div className='space-y-3'>
                  <div className='h-4 bg-muted rounded w-full'></div>
                  <div className='h-4 bg-muted rounded w-2/3'></div>
                  <div className='h-4 bg-muted rounded w-1/2'></div>
                </div>
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
            <h1 className='text-3xl font-display font-bold'>
              Feedback Reviews
            </h1>
            <p className='text-muted-foreground'>
              Create and manage customer feedback requests
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className='bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors flex items-center space-x-2'
          >
            <Plus className='w-4 h-4' />
            <span>Create Review</span>
          </button>
        </div>

        {/* Feedback Reviews List */}
        {feedbackReviews.length === 0 ? (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <MessageSquare className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>
              No feedback reviews found
            </h3>
            <p className='text-muted-foreground mb-4'>
              Start collecting customer feedback by creating your first review
              request.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-[hsl(var(--primary))] text-primary-foreground rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors'
            >
              Create First Review
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {feedbackReviews.map((review) => (
              <div
                key={review._id}
                className='bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-lg'>
                      {review.customerName}
                    </h3>
                    <p className='text-sm text-primary'>{review.eventType}</p>
                    <p className='text-xs text-muted-foreground'>
                      {review.location}
                    </p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    {getStatusIcon(review.status)}
                    <span className='text-xs font-medium'>
                      {getStatusText(review.status)}
                    </span>
                  </div>
                </div>

                <div className='space-y-2 mb-4'>
                  <p className='text-sm text-muted-foreground'>
                    <span className='font-medium'>Date:</span>{' '}
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                  {review.rating && (
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm font-medium'>Rating:</span>
                      <div className='flex'>
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className='text-yellow-400'>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {review.feedback && (
                  <div className='mb-4'>
                    <p className='text-sm text-muted-foreground italic'>
                      &ldquo;{review.feedback}&rdquo;
                    </p>
                  </div>
                )}

                <div className='flex space-x-2'>
                  {review.status === 'pending' && (
                    <div className='flex-1 flex space-x-2'>
                      <button
                        onClick={() => copyFeedbackLink(review.uniqueId)}
                        className={`flex-1 bg-[hsl(var(--primary))] text-primary-foreground cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 text-sm flex items-center justify-center space-x-2 ${
                          copiedLink === review.uniqueId
                            ? 'bg-green-500 text-white'
                            : 'bg-[hsl(var(--primary))] text-primary-foreground hover:bg-[hsl(var(--primary))]/90'
                        }`}
                        title='Copy feedback link to clipboard'
                      >
                        {copiedLink === review.uniqueId ? (
                          <>
                            <CheckCircle className='w-4 h-4' />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className='w-4 h-4' />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => openFeedbackLink(review.uniqueId)}
                        className='px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm flex items-center justify-center'
                        title='Open feedback link in new tab'
                      >
                        <ExternalLink className='w-4 h-4' />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => handleEdit(review)}
                    className='p-2 hover:bg-accent rounded-lg transition-colors'
                    title='Edit Review'
                  >
                    <Edit className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className='p-2 hover:bg-accent rounded-lg transition-colors text-red-500'
                    title='Delete Review'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
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
                  {editingReview
                    ? 'Edit Feedback Review'
                    : 'Create New Feedback Review'}
                </h3>
              </div>

              <div className='overflow-y-auto max-h-[calc(90vh-120px)]'>
                <form onSubmit={handleSubmit} className='p-6 space-y-4 bg-card'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Customer Name
                    </label>
                    <input
                      type='text'
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
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
                      value={formData.eventType}
                      onChange={(e) =>
                        setFormData({ ...formData, eventType: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      placeholder='e.g., Wedding Reception'
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
                      className='bg-[hsl(var(--primary))] text-primary-foreground px-6 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors disabled:opacity-50'
                    >
                      {isSubmitting
                        ? editingReview
                          ? 'Updating...'
                          : 'Creating...'
                        : editingReview
                        ? 'Update Review'
                        : 'Create Review'}
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
