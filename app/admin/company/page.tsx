'use client'

import { useEffect, useState } from 'react'
import { Edit, Save, Building, MapPin, Phone, Mail, Clock } from 'lucide-react'
import AuthGuard from '@/components/admin/auth-guard'

interface CompanyData {
  _id?: string
  name: string
  tagline: string
  description: string
  logo: string
  contact: {
    address: string
    city: string
    province: string
    zipCode: string
    phone: string
    email: string
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    youtube?: string
    tiktok?: string
  }
  businessHours: {
    weekdays: string
    weekends: string
    holidays: string
  }
  serviceAreas: string[]
  founded: number
}

export default function CompanyAdmin() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CompanyData>({
    name: '',
    tagline: '',
    description: '',
    logo: '',
    contact: {
      address: '',
      city: '',
      province: '',
      zipCode: '',
      phone: '',
      email: '',
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      youtube: '',
      tiktok: '',
    },
    businessHours: {
      weekdays: '',
      weekends: '',
      holidays: '',
    },
    serviceAreas: [''],
    founded: new Date().getFullYear(),
  })

  useEffect(() => {
    fetchCompany()
  }, [])

  const fetchCompany = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/company')
      const data = await response.json()

      if (data.success && data.data) {
        setCompanyData(data.data)
        setFormData(data.data)
      }
    } catch (error) {
      console.error('Error fetching company data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        serviceAreas: formData.serviceAreas.filter(
          (area) => area.trim() !== '',
        ),
      }

      const response = await fetch('/api/admin/company', {
        method: companyData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        await fetchCompany()
        setIsEditing(false)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving company data:', error)
      alert('Failed to save company data')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addServiceArea = () => {
    setFormData({ ...formData, serviceAreas: [...formData.serviceAreas, ''] })
  }

  const removeServiceArea = (index: number) => {
    setFormData({
      ...formData,
      serviceAreas: formData.serviceAreas.filter((_, i) => i !== index),
    })
  }

  const updateServiceArea = (index: number, value: string) => {
    const newAreas = [...formData.serviceAreas]
    newAreas[index] = value
    setFormData({ ...formData, serviceAreas: newAreas })
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-display font-bold'>Company Info</h1>
          </div>
          <div className='bg-card rounded-xl p-6 border animate-pulse'>
            <div className='h-6 bg-muted rounded w-1/2 mb-4'></div>
            <div className='h-4 bg-muted rounded w-full mb-2'></div>
            <div className='h-4 bg-muted rounded w-3/4 mb-4'></div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='h-24 bg-muted rounded'></div>
              <div className='h-24 bg-muted rounded'></div>
            </div>
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
            <h1 className='text-3xl font-display font-bold'>Company Info</h1>
            <p className='text-muted-foreground'>
              Manage your company information and contact details
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className='bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2'
            >
              <Edit className='w-4 h-4' />
              <span>Edit Info</span>
            </button>
          ) : (
            <div className='flex space-x-2'>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setFormData(companyData || formData)
                }}
                className='px-4 py-2 text-muted-foreground hover:text-foreground transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 disabled:opacity-50'
              >
                <Save className='w-4 h-4' />
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className='bg-card rounded-xl border border-border p-6'>
          {!companyData && !isEditing ? (
            <div className='text-center py-12'>
              <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
                <Building className='w-8 h-8 text-muted-foreground' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>
                No company information found
              </h3>
              <p className='text-muted-foreground mb-4'>
                Set up your company profile with contact details and business
                information.
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
              >
                Add Company Information
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-8'>
              {/* Basic Company Info */}
              <div className='space-y-6'>
                <h3 className='text-lg font-semibold border-b border-border pb-2'>
                  Basic Information
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Company Name
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='e.g., Legato Sounds and Lights'
                        required
                      />
                    ) : (
                      <p className='text-lg font-semibold'>
                        {companyData?.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Tagline
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={formData.tagline}
                        onChange={(e) =>
                          setFormData({ ...formData, tagline: e.target.value })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='e.g., Professional Sound & Lighting Solutions'
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {companyData?.tagline}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      rows={4}
                      placeholder='Brief description of your company and services...'
                      required
                    />
                  ) : (
                    <p className='text-muted-foreground'>
                      {companyData?.description}
                    </p>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Logo URL
                    </label>
                    {isEditing ? (
                      <input
                        type='url'
                        value={formData.logo}
                        onChange={(e) =>
                          setFormData({ ...formData, logo: e.target.value })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='https://example.com/logo.png'
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {companyData?.logo || 'No logo set'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Founded Year
                    </label>
                    {isEditing ? (
                      <input
                        type='number'
                        min='1900'
                        max={new Date().getFullYear()}
                        value={formData.founded}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            founded:
                              parseInt(e.target.value) ||
                              new Date().getFullYear(),
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='2020'
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {companyData?.founded}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className='space-y-6'>
                <h3 className='text-lg font-semibold border-b border-border pb-2 flex items-center space-x-2'>
                  <MapPin className='w-5 h-5' />
                  <span>Contact Information</span>
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={formData.contact.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: {
                              ...formData.contact,
                              address: e.target.value,
                            },
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='Street address'
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {companyData?.contact.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={formData.contact.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: {
                              ...formData.contact,
                              city: e.target.value,
                            },
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='e.g., Trece Martires'
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {companyData?.contact.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Province
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={formData.contact.province}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: {
                              ...formData.contact,
                              province: e.target.value,
                            },
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='e.g., Cavite'
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {companyData?.contact.province}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Zip Code
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={formData.contact.zipCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: {
                              ...formData.contact,
                              zipCode: e.target.value,
                            },
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='4109'
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {companyData?.contact.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2 flex items-center space-x-1'>
                      <Phone className='w-4 h-4' />
                      <span>Phone</span>
                    </label>
                    {isEditing ? (
                      <input
                        type='tel'
                        value={formData.contact.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: {
                              ...formData.contact,
                              phone: e.target.value,
                            },
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='+63 912 345 6789'
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {companyData?.contact.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2 flex items-center space-x-1'>
                      <Mail className='w-4 h-4' />
                      <span>Email</span>
                    </label>
                    {isEditing ? (
                      <input
                        type='email'
                        value={formData.contact.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: {
                              ...formData.contact,
                              email: e.target.value,
                            },
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='info@legato.com'
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {companyData?.contact.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className='space-y-6'>
                <h3 className='text-lg font-semibold border-b border-border pb-2 flex items-center space-x-2'>
                  <Clock className='w-5 h-5' />
                  <span>Business Hours</span>
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Weekdays
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={formData.businessHours.weekdays}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessHours: {
                              ...formData.businessHours,
                              weekdays: e.target.value,
                            },
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='9:00 AM - 6:00 PM'
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {companyData?.businessHours.weekdays}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Weekends
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={formData.businessHours.weekends}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessHours: {
                              ...formData.businessHours,
                              weekends: e.target.value,
                            },
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='10:00 AM - 4:00 PM'
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {companyData?.businessHours.weekends}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Holidays
                    </label>
                    {isEditing ? (
                      <input
                        type='text'
                        value={formData.businessHours.holidays}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessHours: {
                              ...formData.businessHours,
                              holidays: e.target.value,
                            },
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='By appointment only'
                      />
                    ) : (
                      <p className='text-muted-foreground'>
                        {companyData?.businessHours.holidays}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <label className='block text-sm font-medium'>
                    Service Areas
                  </label>
                  {isEditing && (
                    <button
                      type='button'
                      onClick={addServiceArea}
                      className='text-primary hover:text-primary/80 text-sm'
                    >
                      + Add Area
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className='space-y-2'>
                    {formData.serviceAreas.map((area, index) => (
                      <div key={index} className='flex space-x-2'>
                        <input
                          type='text'
                          value={area}
                          onChange={(e) =>
                            updateServiceArea(index, e.target.value)
                          }
                          className='flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                          placeholder='e.g., Cavite, Metro Manila'
                        />
                        {formData.serviceAreas.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeServiceArea(index)}
                            className='px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors'
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {companyData?.serviceAreas.map((area, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-primary/20 text-primary rounded-full text-sm'
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
