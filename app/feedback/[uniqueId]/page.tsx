'use client'

import { useEffect, useState } from 'react'
import { Star, Send, CheckCircle, User, Camera, Upload, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { use } from 'react'
import Link from 'next/link'
import { uploadToCloudinary } from '@/components/ui/image-upload'

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
}

export default function FeedbackPage({
  params,
}: {
  params: Promise<{ uniqueId: string }>
}) {
  const { uniqueId } = use(params)
  const [feedbackReview, setFeedbackReview] = useState<FeedbackReview | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchFeedbackReview()
  }, [uniqueId])

  const fetchFeedbackReview = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/feedback/${uniqueId}`)
      const data = await response.json()

      if (data.success) {
        setFeedbackReview(data.data)
        if (data.data.status === 'completed') {
          setIsSubmitted(true)
          setRating(data.data.rating || 0)
          setFeedback(data.data.feedback || '')
        }
      } else {
        setError('Feedback review not found or has expired.')
      }
    } catch (error) {
      console.error('Error fetching feedback review:', error)
      setError('Failed to load feedback review.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert('Image size should be less than 5MB')
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    return await uploadToCloudinary(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      alert('Please select a rating before submitting.')
      return
    }

    if (!feedback.trim()) {
      alert('Please provide your feedback before submitting.')
      return
    }

    setIsSubmitting(true)
    setUploadingImage(true)

    try {
      let imageUrl = ''

      // Upload image if selected
      if (selectedImage) {
        try {
          imageUrl = await uploadImageToCloudinary(selectedImage)
          console.log('✅ Image uploaded:', imageUrl)
        } catch (error) {
          console.error('❌ Error uploading image:', error)
          alert('Failed to upload image, but feedback will still be submitted.')
        }
      }

      const response = await fetch(`/api/feedback/${uniqueId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          feedback: feedback.trim(),
          image: imageUrl,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
        setFeedbackReview(data.data)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
      setUploadingImage(false)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading feedback form...</p>
        </div>
      </div>
    )
  }

  if (error || !feedbackReview) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4'>
        <div className='text-center max-w-md'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <User className='w-8 h-8 text-red-500' />
          </div>
          <h1 className='text-2xl font-bold mb-2'>Oops!</h1>
          <p className='text-muted-foreground mb-4'>
            {error || 'Something went wrong.'}
          </p>
          <p className='text-sm text-muted-foreground'>
            This feedback link may have expired or doesn&apos;t exist.
          </p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-card rounded-2xl p-8 max-w-md w-full shadow-xl border border-border'
        >
          <div className='text-center'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CheckCircle className='w-8 h-8 text-green-500' />
            </div>
            <h1 className='text-2xl font-bold mb-2'>Thank You!</h1>
            <p className='text-muted-foreground mb-6'>
              Your feedback has been submitted successfully.
            </p>

            <div className='bg-muted/50 rounded-lg p-4 mb-6'>
              <div className='flex justify-center mb-2'>
                {[...Array(rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-6 h-6 text-yellow-400 fill-current'
                  />
                ))}
              </div>
              <p className='text-sm text-muted-foreground italic'>
                &ldquo;{feedback}&rdquo;
              </p>
              {imagePreview && (
                <div className='mt-4 flex justify-center'>
                  <img
                    src={imagePreview}
                    alt='Your photo'
                    className='w-20 h-20 object-cover rounded-full border-2 border-primary/20'
                  />
                </div>
              )}
            </div>

            <p className='text-sm text-muted-foreground mb-6'>
              We appreciate your time and will use your feedback to improve our
              services.
            </p>

            <Link
              href='/?source=feedback'
              className='inline-flex items-center justify-center px-6 py-3 bg-[hsl(var(--primary))] text-primary-foreground rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors font-medium'
            >
              Visit Our Website
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5'>
      <div className='container mx-auto px-4 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='max-w-md mx-auto'
        >
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='w-20 h-20 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <User className='w-10 h-10 text-primary' />
            </div>
            <h1 className='text-3xl font-bold mb-2'>
              Hi {feedbackReview.customerName}!
            </h1>
            <p className='text-muted-foreground leading-relaxed'>
              Thank you for booking your event with us! We would like to ask
              your feedback on your recent event on{' '}
              <span className='font-semibold text-primary'>
                {feedbackReview.location}
              </span>
              .
            </p>
          </div>

          {/* Event Details */}
          <div className='bg-card rounded-xl p-6 mb-8 shadow-lg border border-border'>
            <h2 className='text-lg font-semibold mb-4'>Event Details</h2>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Event Type:</span>
                <span className='font-medium'>{feedbackReview.eventType}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Location:</span>
                <span className='font-medium'>{feedbackReview.location}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Date:</span>
                <span className='font-medium'>
                  {new Date(feedbackReview.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <motion.form
            onSubmit={handleSubmit}
            className='bg-card rounded-xl p-6 shadow-lg border border-border'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className='text-xl font-semibold mb-6'>
              How was your experience?
            </h2>

            {/* Rating */}
            <div className='mb-6'>
              <label className='block text-sm font-medium mb-3'>Rating</label>
              <div className='flex justify-center space-x-2'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type='button'
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      rating >= star
                        ? 'text-yellow-400 scale-110'
                        : 'text-muted-foreground hover:text-yellow-400'
                    }`}
                  >
                    <Star className='w-8 h-8 fill-current' />
                  </button>
                ))}
              </div>
              <p className='text-center text-sm text-muted-foreground mt-2'>
                {rating === 0 && 'Tap to rate your experience'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            </div>

            {/* Feedback Text */}
            <div className='mb-6'>
              <label className='block text-sm font-medium mb-3'>
                Tell us about your experience
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className='w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
                rows={4}
                placeholder="Share your thoughts about our service, equipment, staff, or anything else you'd like us to know..."
                required
              />
            </div>

            {/* Optional Photo Upload */}
            <div className='mb-6'>
              <label className='block text-sm font-medium mb-3'>
                Add a photo (optional)
              </label>

              {!imagePreview ? (
                <div className='border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageSelect}
                    className='hidden'
                    id='image-upload'
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor='image-upload'
                    className='cursor-pointer flex flex-col items-center space-y-2'
                  >
                    <div className='w-12 h-12 bg-[hsl(var(--primary))]/10 rounded-full flex items-center justify-center'>
                      <Camera className='w-6 h-6 text-primary' />
                    </div>
                    <div>
                      <p className='text-sm font-medium'>Upload a photo</p>
                      <p className='text-xs text-muted-foreground'>
                        JPG, PNG up to 5MB
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className='text-center'>
                  <p className='text-xs text-muted-foreground mb-4'>
                    How it will appear in testimonials:
                  </p>
                  <div className='relative inline-block'>
                    <img
                      src={imagePreview}
                      alt='Avatar Preview'
                      className='w-32 h-32 object-cover rounded-full border-2 border-primary/20 shadow-lg'
                    />
                    <button
                      type='button'
                      onClick={removeImage}
                      className='absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isSubmitting || rating === 0 || !feedback.trim()}
              className='w-full bg-[hsl(var(--primary))] text-primary-foreground py-3 px-6 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
            >
              {isSubmitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  <span>
                    {uploadingImage ? 'Uploading image...' : 'Submitting...'}
                  </span>
                </>
              ) : (
                <>
                  <Send className='w-4 h-4' />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </motion.form>

          {/* Footer */}
          <div className='text-center mt-8'>
            <p className='text-sm text-muted-foreground'>
              Your feedback helps us improve our services for future events.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
