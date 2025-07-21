'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Tag, Wrench } from 'lucide-react'
import AuthGuard from '@/components/admin/auth-guard'
import ImageUpload, { uploadToCloudinary } from '@/components/ui/image-upload'
import ClientGuard from '@/components/admin/client-guard'

interface EquipmentItem {
  name: string
  brand: string
  type: string
  description: string
  features: string[]
  image?: string
}

interface EquipmentCategory {
  _id: string
  name: string
  items: EquipmentItem[]
}

export default function EquipmentAdmin() {
  const [categories, setCategories] = useState<EquipmentCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState<EquipmentCategory | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    items: [
      {
        name: '',
        brand: '',
        type: '',
        description: '',
        features: [''],
        image: '',
      },
    ],
  })
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([null])

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/equipment')
      const data = await response.json()

      if (data.success) {
        const categoriesWithDefaults =
          data.data?.map((category: EquipmentCategory) => ({
            ...category,
            items:
              category.items?.map((item: EquipmentItem) => ({
                ...item,
                features: item.features || [],
              })) || [],
          })) || []
        setCategories(categoriesWithDefaults)
      }
    } catch (error) {
      console.error('Error fetching equipment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Upload any new files to Cloudinary
      const itemsWithImages = await Promise.all(
        formData.items.map(async (item, index) => {
          let imageUrl = item.image

          // If a new file is selected for this item, upload it
          if (selectedFiles[index]) {
            imageUrl = await uploadToCloudinary(selectedFiles[index]!)
          }

          return {
            ...item,
            image: imageUrl,
            features: item.features.filter((f) => f.trim() !== ''),
          }
        }),
      )

      const payload = {
        ...formData,
        items: itemsWithImages,
      }

      const method = editingCategory ? 'PUT' : 'POST'
      const url = editingCategory
        ? `/api/admin/equipment/${editingCategory._id}`
        : '/api/admin/equipment'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        await fetchEquipment() // Refresh the list
        setShowForm(false)
        resetForm()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving equipment:', error)
      alert('Failed to save equipment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (category: EquipmentCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      items: category.items.map((item) => ({
        ...item,
        features: item.features?.length ? item.features : [''],
        image: item.image || '',
      })),
    })
    setSelectedFiles(new Array(category.items.length).fill(null))
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this equipment category?'))
      return

    try {
      const response = await fetch(`/api/admin/equipment/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchEquipment() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting equipment:', error)
      alert('Failed to delete equipment')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      items: [
        {
          name: '',
          brand: '',
          type: '',
          description: '',
          features: [''],
          image: '',
        },
      ],
    })
    setSelectedFiles([null])
    setEditingCategory(null)
  }

  // Item management functions
  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          name: '',
          brand: '',
          type: '',
          description: '',
          features: [''],
          image: '',
        },
      ],
    })
    setSelectedFiles([...selectedFiles, null])
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  // Feature management functions
  const addFeature = (itemIndex: number) => {
    const newItems = [...formData.items]
    newItems[itemIndex].features.push('')
    setFormData({ ...formData, items: newItems })
  }

  const removeFeature = (itemIndex: number, featureIndex: number) => {
    const newItems = [...formData.items]
    newItems[itemIndex].features = newItems[itemIndex].features.filter(
      (_, i) => i !== featureIndex,
    )
    setFormData({ ...formData, items: newItems })
  }

  const updateFeature = (
    itemIndex: number,
    featureIndex: number,
    value: string,
  ) => {
    const newItems = [...formData.items]
    newItems[itemIndex].features[featureIndex] = value
    setFormData({ ...formData, items: newItems })
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-display font-bold'>Equipment</h1>
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
            <h1 className='text-3xl font-display font-bold'>Equipment</h1>
            <p className='text-muted-foreground'>
              Manage your equipment inventory by categories
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className='bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors flex items-center space-x-2'
          >
            <Plus className='w-4 h-4' />
            <span>Add Category</span>
          </button>
        </div>

        {/* Equipment Categories */}
        {categories.length === 0 ? (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <Wrench className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>
              No equipment categories found
            </h3>
            <p className='text-muted-foreground mb-4'>
              Start organizing your equipment by adding your first category.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-[hsl(var(--primary))] text-primary-foreground rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors'
            >
              Add First Category
            </button>
          </div>
        ) : (
          <div className='space-y-8'>
            {categories.map((category) => (
              <div
                key={category._id}
                className='bg-card rounded-xl border border-border p-6'
              >
                {/* Category Header */}
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <h2 className='text-2xl font-semibold'>{category.name}</h2>
                    <p className='text-muted-foreground'>
                      {category.items.length} item(s)
                    </p>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleEdit(category)}
                      className='p-2 hover:bg-accent rounded-lg transition-colors'
                      title='Edit Category'
                    >
                      <Edit className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className='p-2 hover:bg-accent rounded-lg transition-colors text-red-500'
                      title='Delete Category'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                {/* Equipment Items Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className='bg-secondary/30 rounded-lg border border-border/50 overflow-hidden'
                    >
                      {/* Equipment Image */}
                      <div className='aspect-video bg-muted relative overflow-hidden'>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className='w-full h-full object-cover'
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.nextElementSibling?.classList.remove(
                                'hidden',
                              )
                            }}
                          />
                        ) : null}
                        {!item.image && (
                          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted'>
                            <div className='text-center'>
                              <Wrench className='w-8 h-8 text-muted-foreground mx-auto mb-2' />
                              <p className='text-xs text-muted-foreground'>
                                No image
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className='p-4'>
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex-1'>
                            <h3 className='font-semibold'>{item.name}</h3>
                            <div className='flex items-center space-x-2 mt-1'>
                              <span className='px-2 py-1 bg-[hsl(var(--primary))]/20 text-primary text-xs rounded-full'>
                                {item.brand}
                              </span>
                              <div className='flex items-center space-x-1'>
                                <Tag className='w-3 h-3 text-muted-foreground' />
                                <span className='text-xs text-muted-foreground'>
                                  {item.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className='text-sm text-muted-foreground mb-3'>
                          {item.description}
                        </p>

                        {item.features && (item.features?.length || 0) > 0 && (
                          <div>
                            <h4 className='font-medium text-sm mb-2'>
                              Features:
                            </h4>
                            <ul className='text-xs text-muted-foreground space-y-1'>
                              {item.features
                                ?.slice(0, 3)
                                ?.map((feature, featureIndex) => (
                                  <li
                                    key={featureIndex}
                                    className='flex items-start space-x-2'
                                  >
                                    <span className='w-1 h-1 bg-[hsl(var(--primary))] rounded-full mt-1.5 flex-shrink-0'></span>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              {(item.features?.length || 0) > 3 && (
                                <li className='text-xs italic'>
                                  +{(item.features?.length || 0) - 3} more
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
            <div className='relative bg-card border border-border rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden'>
              <div className='p-6 border-b border-border bg-card'>
                <h3 className='text-xl font-display font-bold'>
                  {editingCategory
                    ? 'Edit Equipment Category'
                    : 'Add New Equipment Category'}
                </h3>
              </div>

              <div className='overflow-y-auto max-h-[calc(90vh-120px)]'>
                <form onSubmit={handleSubmit} className='p-6 space-y-6 bg-card'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Category Name
                    </label>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      placeholder='e.g., Audio Equipment, Lighting Equipment'
                      required
                    />
                  </div>

                  {/* Equipment Items */}
                  <div>
                    <div className='flex items-center justify-between mb-4'>
                      <label className='block text-sm font-medium'>
                        Equipment Items
                      </label>
                      <button
                        type='button'
                        onClick={addItem}
                        className='text-primary hover:text-primary/80 text-sm'
                      >
                        + Add Item
                      </button>
                    </div>

                    <div className='space-y-6'>
                      {formData.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className='border border-border rounded-lg p-4 space-y-4'
                        >
                          <div className='flex items-center justify-between'>
                            <h4 className='font-medium'>
                              Item #{itemIndex + 1}
                            </h4>
                            {formData.items.length > 1 && (
                              <button
                                type='button'
                                onClick={() => removeItem(itemIndex)}
                                className='text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors'
                              >
                                <Trash2 className='w-4 h-4' />
                              </button>
                            )}
                          </div>

                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                              <label className='block text-sm font-medium mb-2'>
                                Equipment Name
                              </label>
                              <input
                                type='text'
                                value={item.name}
                                onChange={(e) =>
                                  updateItem(itemIndex, 'name', e.target.value)
                                }
                                className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                                placeholder='e.g., RCF ART 745A'
                                required
                              />
                            </div>

                            <div>
                              <label className='block text-sm font-medium mb-2'>
                                Brand
                              </label>
                              <input
                                type='text'
                                value={item.brand}
                                onChange={(e) =>
                                  updateItem(itemIndex, 'brand', e.target.value)
                                }
                                className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                                placeholder='e.g., RCF'
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className='block text-sm font-medium mb-2'>
                              Type
                            </label>
                            <input
                              type='text'
                              value={item.type}
                              onChange={(e) =>
                                updateItem(itemIndex, 'type', e.target.value)
                              }
                              className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                              placeholder='e.g., Active Speaker'
                              required
                            />
                          </div>

                          <div>
                            <label className='block text-sm font-medium mb-2'>
                              Description
                            </label>
                            <textarea
                              value={item.description}
                              onChange={(e) =>
                                updateItem(
                                  itemIndex,
                                  'description',
                                  e.target.value,
                                )
                              }
                              className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                              rows={3}
                              placeholder="Professional 15' active speaker with exceptional clarity and power"
                              required
                            />
                          </div>

                          <div>
                            <label className='block text-sm font-medium mb-2'>
                              Equipment Image (Optional)
                            </label>
                            <ClientGuard>
                              <ImageUpload
                                value={selectedFiles[itemIndex] || item.image}
                                onChange={(fileOrUrl) => {
                                  if (fileOrUrl instanceof File) {
                                    const newSelectedFiles = [...selectedFiles]
                                    newSelectedFiles[itemIndex] = fileOrUrl
                                    setSelectedFiles(newSelectedFiles)
                                  } else {
                                    updateItem(
                                      itemIndex,
                                      'image',
                                      fileOrUrl || '',
                                    )
                                    const newSelectedFiles = [...selectedFiles]
                                    newSelectedFiles[itemIndex] = null
                                    setSelectedFiles(newSelectedFiles)
                                  }
                                }}
                                disabled={isSubmitting}
                                placeholder='Upload equipment image'
                              />
                            </ClientGuard>
                          </div>

                          {/* Features */}
                          <div>
                            <div className='flex items-center justify-between mb-2'>
                              <label className='block text-sm font-medium'>
                                Features
                              </label>
                              <button
                                type='button'
                                onClick={() => addFeature(itemIndex)}
                                className='text-primary hover:text-primary/80 text-sm'
                              >
                                + Add Feature
                              </button>
                            </div>
                            <div className='space-y-2'>
                              {item.features.map((feature, featureIndex) => (
                                <div
                                  key={featureIndex}
                                  className='flex space-x-2'
                                >
                                  <input
                                    type='text'
                                    value={feature}
                                    onChange={(e) =>
                                      updateFeature(
                                        itemIndex,
                                        featureIndex,
                                        e.target.value,
                                      )
                                    }
                                    className='flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                                    placeholder='e.g., 1400W Peak Power'
                                  />
                                  {item.features.length > 1 && (
                                    <button
                                      type='button'
                                      onClick={() =>
                                        removeFeature(itemIndex, featureIndex)
                                      }
                                      className='px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors'
                                    >
                                      <Trash2 className='w-4 h-4' />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
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
                      className='bg-[hsl(var(--primary))] text-primary-foreground px-6 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors disabled:opacity-50'
                    >
                      {isSubmitting
                        ? editingCategory
                          ? 'Updating...'
                          : 'Adding...'
                        : editingCategory
                        ? 'Update Category'
                        : 'Add Category'}
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
