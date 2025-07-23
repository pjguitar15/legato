'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, ImageIcon, MapPin, Calendar } from 'lucide-react'
import AuthGuard from '@/components/admin/auth-guard'
import Image from 'next/image'
import ImageUpload, { uploadToCloudinary } from '@/components/ui/image-upload'
import ClientGuard from '@/components/admin/client-guard'

interface GalleryItem {
  _id: string
  url: string
  caption: string
  eventType: string
  location: string
  date: string
}

export default function GalleryAdmin() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    url: '',
    caption: '',
    eventType: '',
    location: '',
    date: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/gallery')
      const data = await response.json()

      if (data.success) {
        setGallery(data.data)
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl = formData.url

      // If a new file is selected, upload it to Cloudinary
      if (selectedFile) {
        imageUrl = await uploadToCloudinary(selectedFile)
      }

      const payload = {
        ...formData,
        url: imageUrl,
      }

      const method = editingItem ? 'PUT' : 'POST'
      const url = editingItem
        ? `/api/admin/gallery/${editingItem._id}`
        : '/api/admin/gallery'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        await fetchGallery() // Refresh the list
        setShowForm(false)
        resetForm()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving gallery item:', error)
      alert('Failed to save gallery item')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      url: item.url,
      caption: item.caption,
      eventType: item.eventType,
      location: item.location,
      date: item.date,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchGallery() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error)
      alert('Failed to delete gallery item')
    }
  }

  const resetForm = () => {
    setFormData({
      url: '',
      caption: '',
      eventType: '',
      location: '',
      date: '',
    })
    setSelectedFile(null)
    setEditingItem(null)
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-display font-bold'>Gallery</h1>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className='bg-card rounded-xl border animate-pulse'
              >
                <div className='h-48 bg-muted rounded-t-xl'></div>
                <div className='p-4'>
                  <div className='h-4 bg-muted rounded w-3/4 mb-2'></div>
                  <div className='h-3 bg-muted rounded w-1/2 mb-1'></div>
                  <div className='h-3 bg-muted rounded w-2/3'></div>
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
            <h1 className='text-3xl font-display font-bold'>Gallery</h1>
            <p className='text-muted-foreground'>
              Manage your portfolio of events and performances
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className='bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors flex items-center space-x-2'
          >
            <Plus className='w-4 h-4' />
            <span>Add Image</span>
          </button>
        </div>

        {/* Gallery Grid */}
        {gallery.length === 0 ? (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <ImageIcon className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>
              No gallery items found
            </h3>
            <p className='text-muted-foreground mb-4'>
              Start showcasing your work by adding your first gallery image.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-[hsl(var(--primary))] text-primary-foreground rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors'
            >
              Add First Image
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {gallery.map((item) => (
              <div
                key={item._id}
                className='bg-card rounded-xl border border-border hover:shadow-lg transition-shadow overflow-hidden'
              >
                {/* Image */}
                <div className='relative h-48'>
                  <Image
                    src={item.url}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className='object-cover'
                  />
                  {/* Action buttons overlay */}
                  <div className='absolute top-2 right-2 flex space-x-2'>
                    <button
                      onClick={() => handleEdit(item)}
                      className='p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors text-white'
                      title='Edit Image'
                    >
                      <Edit className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className='p-2 bg-black/50 hover:bg-red-600/70 rounded-lg transition-colors text-white'
                      title='Delete Image'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                <div className='p-4'>
                  {/* Caption */}
                  <h3 className='font-semibold mb-2'>{item.caption}</h3>

                  {/* Event Type */}
                  <div className='mb-3'>
                    <span className='px-2 py-1 bg-[hsl(var(--primary))]/20 text-primary text-xs rounded-full'>
                      {item.eventType}
                    </span>
                  </div>

                  {/* Details */}
                  <div className='space-y-1 text-sm text-muted-foreground'>
                    <div className='flex items-center space-x-1'>
                      <MapPin className='w-3 h-3' />
                      <span>{item.location}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <Calendar className='w-3 h-3' />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
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
                  {editingItem ? 'Edit Gallery Image' : 'Add New Gallery Image'}
                </h3>
              </div>

              <div className='overflow-y-auto max-h-[calc(90vh-120px)]'>
                <form onSubmit={handleSubmit} className='p-6 space-y-4 bg-card'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Gallery Image
                    </label>
                    <ClientGuard>
                      <ImageUpload
                        value={selectedFile || formData.url}
                        onChange={(fileOrUrl) => {
                          if (fileOrUrl instanceof File) {
                            setSelectedFile(fileOrUrl)
                          } else {
                            setFormData({ ...formData, url: fileOrUrl || '' })
                            setSelectedFile(null)
                          }
                        }}
                        disabled={isSubmitting}
                        placeholder='Upload gallery image'
                      />
                    </ClientGuard>
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Caption
                    </label>
                    <input
                      type='text'
                      value={formData.caption}
                      onChange={(e) =>
                        setFormData({ ...formData, caption: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      placeholder='e.g., Rock concert at SM Trece Martires'
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
                      placeholder='e.g., Concert, Wedding, Corporate'
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
                      placeholder='e.g., Cavite City'
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
                        ? editingItem
                          ? 'Updating...'
                          : 'Adding...'
                        : editingItem
                        ? 'Update Image'
                        : 'Add Image'}
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
