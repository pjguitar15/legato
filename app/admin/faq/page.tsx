'use client'

import { useEffect, useState } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  HelpCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import AuthGuard from '@/components/admin/auth-guard'

interface FAQ {
  _id: string
  question: string
  answer: string
  order: number
}

export default function FAQAdmin() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order: 0,
  })

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/faq')
      const data = await response.json()

      if (data.success) {
        setFaqs(data.data)
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const method = editingFaq ? 'PUT' : 'POST'
      const url = editingFaq
        ? `/api/admin/faq/${editingFaq._id}`
        : '/api/admin/faq'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        await fetchFaqs() // Refresh the list
        setShowForm(false)
        resetForm()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving FAQ:', error)
      alert('Failed to save FAQ')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    try {
      const response = await fetch(`/api/admin/faq/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchFaqs() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      alert('Failed to delete FAQ')
    }
  }

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      order: faqs.length,
    })
    setEditingFaq(null)
  }

  const moveUp = async (faq: FAQ) => {
    const newOrder = faq.order - 1
    if (newOrder < 0) return

    try {
      const response = await fetch(`/api/admin/faq/${faq._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...faq, order: newOrder }),
      })

      if (response.ok) {
        await fetchFaqs()
      }
    } catch (error) {
      console.error('Error updating FAQ order:', error)
    }
  }

  const moveDown = async (faq: FAQ) => {
    const newOrder = faq.order + 1
    if (newOrder >= faqs.length) return

    try {
      const response = await fetch(`/api/admin/faq/${faq._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...faq, order: newOrder }),
      })

      if (response.ok) {
        await fetchFaqs()
      }
    } catch (error) {
      console.error('Error updating FAQ order:', error)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-display font-bold'>FAQ</h1>
          </div>
          <div className='space-y-4'>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className='bg-card rounded-xl p-6 border animate-pulse'
              >
                <div className='h-5 bg-muted rounded w-3/4 mb-3'></div>
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
            <h1 className='text-3xl font-display font-bold'>FAQ</h1>
            <p className='text-muted-foreground'>
              Manage frequently asked questions
            </p>
          </div>
          <button
            onClick={() => {
              setFormData({ ...formData, order: faqs.length })
              setShowForm(true)
            }}
            className='bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors flex items-center space-x-2'
          >
            <Plus className='w-4 h-4' />
            <span>Add FAQ</span>
          </button>
        </div>

        {/* FAQ List */}
        {faqs.length === 0 ? (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <HelpCircle className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>No FAQ items found</h3>
            <p className='text-muted-foreground mb-4'>
              Help your customers by adding frequently asked questions.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-[hsl(var(--primary))] text-primary-foreground rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors'
            >
              Add First FAQ
            </button>
          </div>
        ) : (
          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <div
                key={faq._id}
                className='bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <span className='text-xs bg-secondary px-2 py-1 rounded-full'>
                        #{faq.order + 1}
                      </span>
                    </div>
                    <h3 className='text-lg font-semibold mb-3'>
                      {faq.question}
                    </h3>
                    <p className='text-muted-foreground'>{faq.answer}</p>
                  </div>

                  <div className='flex items-center space-x-2 ml-4'>
                    {/* Reorder buttons */}
                    <div className='flex flex-col space-y-1'>
                      <button
                        onClick={() => moveUp(faq)}
                        disabled={index === 0}
                        className='p-1 hover:bg-accent rounded disabled:opacity-50 disabled:cursor-not-allowed'
                        title='Move Up'
                      >
                        <ArrowUp className='w-3 h-3' />
                      </button>
                      <button
                        onClick={() => moveDown(faq)}
                        disabled={index === faqs.length - 1}
                        className='p-1 hover:bg-accent rounded disabled:opacity-50 disabled:cursor-not-allowed'
                        title='Move Down'
                      >
                        <ArrowDown className='w-3 h-3' />
                      </button>
                    </div>

                    {/* Edit/Delete buttons */}
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => handleEdit(faq)}
                        className='p-2 hover:bg-accent rounded-lg transition-colors'
                        title='Edit FAQ'
                      >
                        <Edit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(faq._id)}
                        className='p-2 hover:bg-accent rounded-lg transition-colors text-red-500'
                        title='Delete FAQ'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
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
                  {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                </h3>
              </div>

              <div className='overflow-y-auto max-h-[calc(90vh-120px)]'>
                <form onSubmit={handleSubmit} className='p-6 space-y-4 bg-card'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Question
                    </label>
                    <input
                      type='text'
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      placeholder='e.g., What areas do you serve?'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Answer
                    </label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) =>
                        setFormData({ ...formData, answer: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      rows={4}
                      placeholder='Provide a clear and helpful answer...'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Display Order
                    </label>
                    <input
                      type='number'
                      min='0'
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value),
                        })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      placeholder='0'
                    />
                    <p className='text-xs text-muted-foreground mt-1'>
                      Lower numbers appear first
                    </p>
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
                        ? editingFaq
                          ? 'Updating...'
                          : 'Adding...'
                        : editingFaq
                        ? 'Update FAQ'
                        : 'Add FAQ'}
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
