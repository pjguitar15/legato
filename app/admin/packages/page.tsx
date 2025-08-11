'use client'

import { useEffect, useState } from 'react'
import AuthGuard from '@/components/admin/auth-guard'
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Users,
  Image as ImageIcon,
} from 'lucide-react'
import ImageUpload, { uploadToCloudinary } from '@/components/ui/image-upload'

interface Package {
  _id: string
  name: string
  description: string
  price: number
  currency: string
  features: string[]
  equipment: string[]
  idealFor: string
  maxGuests: number
  popular: boolean
  image?: string
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allEquipment, setAllEquipment] = useState<
    { name: string; image?: string }[]
  >([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: '₱',
    features: [''],
    equipment: [''],
    idealFor: '',
    maxGuests: 50,
    popular: false,
    image: '' as string,
  })

  useEffect(() => {
    fetchPackages()
    fetchEquipmentLibrary()
  }, [])
  const fetchEquipmentLibrary = async () => {
    try {
      const res = await fetch('/api/equipment')
      const json = await res.json()
      if (json.success) {
        const items = (json.data || [])
          .flatMap((cat: any) => cat.items || [])
          .map((i: any) => ({
            name: i.name as string,
            image: i.image as string | undefined,
          }))
        // dedupe by name
        const seen = new Set<string>()
        const unique = items.filter((i: any) =>
          seen.has(i.name) ? false : (seen.add(i.name), true),
        )
        setAllEquipment(unique)
      }
    } catch (e) {
      console.error('Failed to load equipment library', e)
      setAllEquipment([])
    }
  }

  const fetchPackages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/packages')
      const data = await response.json()

      if (data.success) {
        const packagesWithDefaults =
          data.data?.map((pkg: any) => ({
            ...pkg,
            features: pkg.features || [],
            equipment: pkg.equipment || [],
          })) || []
        setPackages(packagesWithDefaults)
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const method = editingPackage ? 'PUT' : 'POST'
      const url = editingPackage
        ? `/api/admin/packages/${editingPackage._id}`
        : '/api/admin/packages'

      // Upload image if a File instance is provided via ImageUpload
      let imageUrl = formData.image
      if (
        typeof window !== 'undefined' &&
        (formData as any)._imageFile instanceof File
      ) {
        imageUrl = await uploadToCloudinary((formData as any)._imageFile)
      }

      const payload = {
        ...formData,
        image: imageUrl,
        features: formData.features.filter((f) => f.trim() !== ''),
        equipment: formData.equipment.filter((e) => e.trim() !== ''),
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
        await fetchPackages()
        setShowForm(false)
        resetForm()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving package:', error)
      alert('Failed to save package')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      currency: pkg.currency,
      features: pkg.features?.length ? pkg.features : [''],
      equipment: pkg.equipment?.length ? pkg.equipment : [''],
      idealFor: pkg.idealFor,
      maxGuests: pkg.maxGuests,
      popular: pkg.popular,
      image: pkg.image || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return

    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchPackages()
      }
    } catch (error) {
      console.error('Error deleting package:', error)
      alert('Failed to delete package')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: '₱',
      features: [''],
      equipment: [''],
      idealFor: '',
      maxGuests: 50,
      popular: false,
      image: '',
    })
    setEditingPackage(null)
  }

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] })
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const addEquipment = () => {
    setFormData({ ...formData, equipment: [...formData.equipment, ''] })
  }

  const removeEquipment = (index: number) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.filter((_, i) => i !== index),
    })
  }

  const updateEquipment = (index: number, value: string) => {
    const newEquipment = [...formData.equipment]
    newEquipment[index] = value
    setFormData({ ...formData, equipment: newEquipment })
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-display font-bold'>Packages</h1>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className='bg-card rounded-lg p-6 border animate-pulse'
              >
                <div className='h-6 bg-muted rounded w-3/4 mb-4'></div>
                <div className='h-4 bg-muted rounded w-full mb-2'></div>
                <div className='h-4 bg-muted rounded w-5/6 mb-4'></div>
                <div className='h-8 bg-muted rounded w-1/2 mb-4'></div>
                <div className='flex space-x-2'>
                  <div className='h-8 bg-muted rounded w-16'></div>
                  <div className='h-8 bg-muted rounded w-16'></div>
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
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-display font-bold'>Packages</h1>
            <p className='text-muted-foreground'>
              Manage service packages and pricing
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className='flex items-center space-x-2 px-4 py-2 bg-[hsl(var(--primary))] text-primary-foreground rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors'
          >
            <Plus className='w-4 h-4' />
            <span>Add Package</span>
          </button>
        </div>

        {/* Packages Grid */}
        {packages.length === 0 ? (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <DollarSign className='w-8 h-8 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>No packages found</h3>
            <p className='text-muted-foreground mb-4'>
              Get started by adding your first service package or initialize the
              database.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className='px-4 py-2 bg-[hsl(var(--primary))] text-primary-foreground rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors'
            >
              Add First Package
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className={`bg-card rounded-lg p-6 border transition-all hover:shadow-md ${
                  pkg.popular ? 'border-primary shadow-md' : ''
                }`}
              >
                {/* Package Header */}
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-xl font-semibold'>{pkg.name}</h3>
                    {pkg.popular && (
                      <span className='inline-block px-2 py-1 bg-[hsl(var(--primary))] text-primary-foreground text-xs rounded-full mt-1'>
                        Popular
                      </span>
                    )}
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleEdit(pkg)}
                      className='p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors'
                      title='Edit Package'
                    >
                      <Edit className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className='p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors'
                      title='Delete Package'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                {/* Image preview (if present) */}
                {pkg.image && (
                  <div className='mb-4'>
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className='w-full rounded-lg border border-border object-cover max-h-40'
                    />
                  </div>
                )}
                {/* Description */}
                <p className='text-muted-foreground text-sm mb-4'>
                  {pkg.description}
                </p>

                {/* Price */}
                <div className='mb-4'>
                  <div className='flex items-baseline space-x-1'>
                    <span className='text-2xl font-bold text-primary'>
                      {pkg.currency}
                      {pkg.price?.toLocaleString() ?? '0'}
                    </span>
                    <span className='text-muted-foreground text-sm'>
                      per event
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className='flex items-center justify-between text-sm text-muted-foreground mb-4'>
                  <div className='flex items-center space-x-1'>
                    <Users className='w-4 h-4' />
                    <span>Max {pkg.maxGuests} guests</span>
                  </div>
                  <span>{pkg.features?.length || 0} features</span>
                </div>

                {/* Features Preview */}
                <div className='mb-4'>
                  <h4 className='font-medium text-sm mb-2'>Key Features:</h4>
                  <ul className='text-sm text-muted-foreground space-y-1'>
                    {pkg.features?.slice(0, 3).map((feature, index) => (
                      <li key={index} className='flex items-start space-x-2'>
                        <span className='w-1 h-1 bg-[hsl(var(--primary))] rounded-full mt-2 flex-shrink-0'></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {(pkg.features?.length || 0) > 3 && (
                      <li className='text-xs italic'>
                        +{(pkg.features?.length || 0) - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Equipment Preview (with image if available) */}
                {pkg.equipment?.length ? (
                  <div className='mb-4'>
                    <h4 className='font-medium text-sm mb-2'>
                      Equipment Included:
                    </h4>
                    <ul className='text-sm text-muted-foreground space-y-1'>
                      {pkg.equipment.slice(0, 3).map((eqName, index) => (
                        <li key={index} className='flex items-center space-x-2'>
                          <div className='w-6 h-6 rounded overflow-hidden border border-border bg-muted'>
                            {(() => {
                              const eq = allEquipment.find(
                                (e) => e.name === eqName,
                              )
                              return eq?.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={eq.image}
                                  alt={eqName}
                                  className='w-full h-full object-cover'
                                />
                              ) : null
                            })()}
                          </div>
                          <span>{eqName}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* Ideal For */}
                <div className='text-sm'>
                  <span className='font-medium'>Perfect for: </span>
                  <span className='text-muted-foreground'>{pkg.idealFor}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Form Modal - Fixed Background */}
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
                  {editingPackage ? 'Edit Package' : 'Add New Package'}
                </h3>
              </div>

              <div className='overflow-y-auto max-h-[calc(90vh-120px)]'>
                <form onSubmit={handleSubmit} className='p-6 space-y-6 bg-card'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Package Name
                      </label>
                      <input
                        type='text'
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='e.g., Full Band Setup'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Ideal For
                      </label>
                      <input
                        type='text'
                        value={formData.idealFor}
                        onChange={(e) =>
                          setFormData({ ...formData, idealFor: e.target.value })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='e.g., Rock concerts, live performances'
                        required
                      />
                    </div>
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
                      placeholder='Describe the package and what it includes...'
                      required
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Price
                      </label>
                      <input
                        type='number'
                        min='0'
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: parseInt(e.target.value) || 0,
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='15000'
                        required
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Currency
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) =>
                          setFormData({ ...formData, currency: e.target.value })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      >
                        <option value='₱'>₱ (PHP)</option>
                        <option value='$'>$ (USD)</option>
                        <option value='€'>€ (EUR)</option>
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Max Guests
                      </label>
                      <input
                        type='number'
                        min='1'
                        value={formData.maxGuests}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxGuests: parseInt(e.target.value) || 50,
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='50'
                        required
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Image
                    </label>
                    <ImageUpload
                      value={formData.image}
                      onChange={(fileOrUrl) => {
                        if (fileOrUrl instanceof File) {
                          // temporarily store file; will upload on submit
                          setFormData({
                            ...(formData as any),
                            _imageFile: fileOrUrl,
                          } as any)
                        } else if (typeof fileOrUrl === 'string') {
                          setFormData({ ...formData, image: fileOrUrl })
                        } else {
                          setFormData({ ...formData, image: '' })
                        }
                      }}
                      placeholder='Click to select package image'
                    />
                  </div>

                  <div>
                    <div className='flex items-center space-x-2 mb-4'>
                      <input
                        type='checkbox'
                        id='popular'
                        checked={formData.popular}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            popular: e.target.checked,
                          })
                        }
                        className='rounded border-border'
                      />
                      <label htmlFor='popular' className='text-sm font-medium'>
                        Mark as Popular Package
                      </label>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='block text-sm font-medium'>
                        Features
                      </label>
                      <button
                        type='button'
                        onClick={addFeature}
                        className='text-primary hover:text-primary/80 text-sm'
                      >
                        + Add Feature
                      </button>
                    </div>
                    <div className='space-y-2'>
                      {formData.features.map((feature, index) => (
                        <div key={index} className='flex space-x-2'>
                          <input
                            type='text'
                            value={feature}
                            onChange={(e) =>
                              updateFeature(index, e.target.value)
                            }
                            className='flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                            placeholder='e.g., Professional sound system'
                          />
                          {formData.features.length > 1 && (
                            <button
                              type='button'
                              onClick={() => removeFeature(index)}
                              className='px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Equipment (from library only) */}
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='block text-sm font-medium'>
                        Equipment Included
                      </label>
                      <button
                        type='button'
                        onClick={addEquipment}
                        className='text-primary hover:text-primary/80 text-sm'
                      >
                        + Add Equipment
                      </button>
                    </div>
                    <div className='space-y-2'>
                      {formData.equipment.map((item, index) => (
                        <div
                          key={index}
                          className='flex items-center space-x-2'
                        >
                          <div className='w-10 h-10 rounded-md overflow-hidden border border-border bg-muted'>
                            {(() => {
                              const eq = allEquipment.find(
                                (e) => e.name === item,
                              )
                              return eq?.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={eq.image}
                                  alt={item}
                                  className='w-full h-full object-cover'
                                />
                              ) : null
                            })()}
                          </div>
                          <select
                            value={item}
                            onChange={(e) =>
                              updateEquipment(index, e.target.value)
                            }
                            className='flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                          >
                            <option value='' disabled>
                              Select equipment...
                            </option>
                            {allEquipment.map((eq) => (
                              <option key={eq.name} value={eq.name}>
                                {eq.name}
                              </option>
                            ))}
                          </select>
                          {formData.equipment.length > 1 && (
                            <button
                              type='button'
                              onClick={() => removeEquipment(index)}
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
                      className='bg-[hsl(var(--primary))] text-primary-foreground px-6 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors disabled:opacity-50'
                    >
                      {isSubmitting
                        ? editingPackage
                          ? 'Updating...'
                          : 'Adding...'
                        : editingPackage
                        ? 'Update Package'
                        : 'Add Package'}
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
