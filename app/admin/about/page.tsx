'use client'

import { useEffect, useState } from 'react'
import { Edit, Save, Users } from 'lucide-react'
import AuthGuard from '@/components/admin/auth-guard'
import ImageUpload, { uploadToCloudinary } from '@/components/ui/image-upload'

interface AboutData {
  _id?: string
  title: string
  description: string
  story: string
  mission: string
  vision: string
  values: string[]
  experience: {
    years: number
    events: number
    clients: number
  }
  team: {
    name: string
    role: string
    experience: string
    specialization: string
    image?: string
    bio: string
  }[]
}

export default function AboutAdmin() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<{
    [key: number]: boolean
  }>({})
  const [formData, setFormData] = useState<AboutData>({
    title: '',
    description: '',
    story: '',
    mission: '',
    vision: '',
    values: [''],
    experience: {
      years: 0,
      events: 0,
      clients: 0,
    },
    team: [
      {
        name: '',
        role: '',
        experience: '',
        specialization: '',
        image: '',
        bio: '',
      },
    ],
  })

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      console.log('📡 About Admin: Fetching data from /api/admin/about')
      setIsLoading(true)
      const response = await fetch('/api/admin/about')
      console.log('📨 About Admin: Response status:', response.status)

      const data = await response.json()
      console.log('📋 About Admin: Response data:', data)

      if (data.success && data.data) {
        console.log('✅ About Admin: Setting about data:', data.data)
        setAboutData(data.data)
        setFormData({
          ...data.data,
          values: data.data.values || [],
          experience: data.data.experience || {
            years: 0,
            events: 0,
            clients: 0,
          },
          team: data.data.team || [],
        })
        console.log('📝 About Admin: Form data set successfully')
      } else {
        console.warn('⚠️ About Admin: No data found or unsuccessful response')
        console.log('📊 About Admin: Full response:', data)
      }
    } catch (error) {
      console.error('❌ About Admin: Error fetching about data:', error)
    } finally {
      setIsLoading(false)
      console.log('✋ About Admin: Fetch completed')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        values: formData.values.filter((v) => v.trim() !== ''),
        team: formData.team.filter((t) => t.name.trim() !== ''),
      }

      const response = await fetch('/api/admin/about', {
        method: aboutData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        await fetchAbout()
        setIsEditing(false)
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving about data:', error)
      alert('Failed to save about data')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addValue = () => {
    setFormData({ ...formData, values: [...formData.values, ''] })
  }

  const removeValue = (index: number) => {
    setFormData({
      ...formData,
      values: formData.values.filter((_, i) => i !== index),
    })
  }

  const updateValue = (index: number, value: string) => {
    const newValues = [...formData.values]
    newValues[index] = value
    setFormData({ ...formData, values: newValues })
  }

  const addTeamMember = () => {
    setFormData({
      ...formData,
      team: [
        ...formData.team,
        {
          name: '',
          role: '',
          experience: '',
          specialization: '',
          image: '',
          bio: '',
        },
      ],
    })
  }

  const removeTeamMember = (index: number) => {
    setFormData({
      ...formData,
      team: formData.team.filter((_, i) => i !== index),
    })
  }

  const updateTeamMember = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newTeam = [...formData.team]
    newTeam[index] = { ...newTeam[index], [field]: value }
    setFormData({ ...formData, team: newTeam })
  }

  const handleTeamMemberImageUpload = async (
    index: number,
    file: File | string | null,
  ) => {
    if (!file) {
      // Remove image
      updateTeamMember(index, 'image', '')
      return
    }

    if (typeof file === 'string') {
      // Already a URL, just update
      updateTeamMember(index, 'image', file)
      return
    }

    // Upload new file to Cloudinary
    try {
      setUploadingImages((prev) => ({ ...prev, [index]: true }))
      const imageUrl = await uploadToCloudinary(file)
      updateTeamMember(index, 'image', imageUrl)
    } catch (error) {
      console.error('Error uploading team member image:', error)
      // You might want to show a toast notification here
    } finally {
      setUploadingImages((prev) => ({ ...prev, [index]: false }))
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-display font-bold'>About Us</h1>
          </div>
          <div className='bg-card rounded-xl p-6 border animate-pulse'>
            <div className='h-6 bg-muted rounded w-1/2 mb-4'></div>
            <div className='h-4 bg-muted rounded w-full mb-2'></div>
            <div className='h-4 bg-muted rounded w-3/4 mb-4'></div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='h-24 bg-muted rounded'></div>
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
            <h1 className='text-3xl font-display font-bold'>About Us</h1>
            <p className='text-muted-foreground'>
              Manage your company's about information
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className='bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors flex items-center space-x-2'
            >
              <Edit className='w-4 h-4' />
              <span>Edit About</span>
            </button>
          ) : (
            <div className='flex space-x-2'>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setFormData(aboutData || formData)
                }}
                className='px-4 py-2 text-muted-foreground hover:text-foreground transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors flex items-center space-x-2 disabled:opacity-50'
              >
                <Save className='w-4 h-4' />
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className='bg-card rounded-xl border border-border p-6'>
          {!aboutData && !isEditing ? (
            <div className='text-center py-12'>
              <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
                <Users className='w-8 h-8 text-muted-foreground' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>
                No about information found
              </h3>
              <p className='text-muted-foreground mb-4'>
                Start building your company profile by adding about information.
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className='px-4 py-2 bg-[hsl(var(--primary))] text-primary-foreground rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors'
              >
                Add About Information
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Basic Info */}
              <div className='grid grid-cols-1 gap-6'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Title
                  </label>
                  {isEditing ? (
                    <input
                      type='text'
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      placeholder='e.g., About Legato Sounds and Lights'
                      required
                    />
                  ) : (
                    <p className='text-lg font-semibold'>{aboutData?.title}</p>
                  )}
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
                      rows={3}
                      placeholder='Brief description of your company...'
                      required
                    />
                  ) : (
                    <p className='text-muted-foreground'>
                      {aboutData?.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Our Story
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.story}
                      onChange={(e) =>
                        setFormData({ ...formData, story: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      rows={4}
                      placeholder="Tell your company's story..."
                      required
                    />
                  ) : (
                    <p className='text-muted-foreground whitespace-pre-wrap'>
                      {aboutData?.story}
                    </p>
                  )}
                </div>
              </div>

              {/* Mission, Vision, Values */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Mission
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.mission}
                      onChange={(e) =>
                        setFormData({ ...formData, mission: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      rows={3}
                      placeholder='Company mission statement...'
                      required
                    />
                  ) : (
                    <p className='text-muted-foreground'>
                      {aboutData?.mission}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Vision
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.vision}
                      onChange={(e) =>
                        setFormData({ ...formData, vision: e.target.value })
                      }
                      className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                      rows={3}
                      placeholder='Company vision statement...'
                      required
                    />
                  ) : (
                    <p className='text-muted-foreground'>{aboutData?.vision}</p>
                  )}
                </div>
              </div>

              {/* Experience Stats */}
              <div>
                <label className='block text-sm font-medium mb-4'>
                  Experience & Stats
                </label>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-xs font-medium mb-1'>
                      Years of Experience
                    </label>
                    {isEditing ? (
                      <input
                        type='number'
                        min='0'
                        value={formData.experience.years}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: {
                              ...formData.experience,
                              years: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='5'
                      />
                    ) : (
                      <p className='text-2xl font-bold text-primary'>
                        {aboutData?.experience?.years || 0}+
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-xs font-medium mb-1'>
                      Events Completed
                    </label>
                    {isEditing ? (
                      <input
                        type='number'
                        min='0'
                        value={formData.experience.events}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: {
                              ...formData.experience,
                              events: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='200'
                      />
                    ) : (
                      <p className='text-2xl font-bold text-primary'>
                        {aboutData?.experience?.events || 0}+
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-xs font-medium mb-1'>
                      Happy Clients
                    </label>
                    {isEditing ? (
                      <input
                        type='number'
                        min='0'
                        value={formData.experience.clients}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: {
                              ...formData.experience,
                              clients: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                        placeholder='150'
                      />
                    ) : (
                      <p className='text-2xl font-bold text-primary'>
                        {aboutData?.experience?.clients || 0}+
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Values */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-medium'>
                    Company Values
                  </label>
                  {isEditing && (
                    <button
                      type='button'
                      onClick={addValue}
                      className='text-primary hover:text-primary/80 text-sm'
                    >
                      + Add Value
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className='space-y-2'>
                    {formData.values.map((value, index) => (
                      <div key={index} className='flex space-x-2'>
                        <input
                          type='text'
                          value={value}
                          onChange={(e) => updateValue(index, e.target.value)}
                          className='flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                          placeholder='e.g., Quality, Reliability, Innovation'
                        />
                        {formData.values.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeValue(index)}
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
                    {aboutData?.values?.map((value, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-[hsl(var(--primary))]/20 text-primary rounded-full text-sm'
                      >
                        {value}
                      </span>
                    )) || (
                      <span className='text-muted-foreground text-sm'>
                        No values set
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Team Section */}
              <div>
                <div className='flex items-center justify-between mb-4'>
                  <label className='block text-lg font-semibold'>
                    Team Members
                  </label>
                  {isEditing && (
                    <button
                      type='button'
                      onClick={addTeamMember}
                      className='bg-[hsl(var(--primary))] text-primary-foreground px-3 py-2 rounded-lg hover:bg-[hsl(var(--primary))]/90 transition-colors text-sm flex items-center space-x-2'
                    >
                      <Users className='w-4 h-4' />
                      <span>Add Member</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className='space-y-6'>
                    {formData.team?.map((member, index) => (
                      <div
                        key={index}
                        className='border border-border rounded-lg p-4 bg-background/50'
                      >
                        <div className='flex items-center justify-between mb-4'>
                          <h4 className='font-semibold text-lg'>
                            Team Member {index + 1}
                          </h4>
                          {formData.team.length > 1 && (
                            <button
                              type='button'
                              onClick={() => removeTeamMember(index)}
                              className='text-red-500 hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors text-sm'
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <label className='block text-sm font-medium mb-1'>
                              Name *
                            </label>
                            <input
                              type='text'
                              value={member.name}
                              onChange={(e) =>
                                updateTeamMember(index, 'name', e.target.value)
                              }
                              className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                              placeholder='e.g., John Doe'
                            />
                          </div>

                          <div>
                            <label className='block text-sm font-medium mb-1'>
                              Role *
                            </label>
                            <input
                              type='text'
                              value={member.role}
                              onChange={(e) =>
                                updateTeamMember(index, 'role', e.target.value)
                              }
                              className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                              placeholder='e.g., Lead Sound Engineer'
                            />
                          </div>

                          <div>
                            <label className='block text-sm font-medium mb-1'>
                              Experience *
                            </label>
                            <input
                              type='text'
                              value={member.experience}
                              onChange={(e) =>
                                updateTeamMember(
                                  index,
                                  'experience',
                                  e.target.value,
                                )
                              }
                              className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                              placeholder='e.g., 5+ years'
                            />
                          </div>

                          <div>
                            <label className='block text-sm font-medium mb-1'>
                              Specialization *
                            </label>
                            <input
                              type='text'
                              value={member.specialization}
                              onChange={(e) =>
                                updateTeamMember(
                                  index,
                                  'specialization',
                                  e.target.value,
                                )
                              }
                              className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                              placeholder='e.g., Live Sound Engineering, Drummer'
                            />
                          </div>

                          <div className='md:col-span-2'>
                            <label className='block text-sm font-medium mb-1'>
                              Profile Image
                            </label>
                            <ImageUpload
                              value={member.image || ''}
                              onChange={(file) =>
                                handleTeamMemberImageUpload(index, file)
                              }
                              disabled={uploadingImages[index] || isSubmitting}
                              placeholder='Upload team member photo'
                              className='w-full'
                            />
                            {uploadingImages[index] && (
                              <p className='text-xs text-muted-foreground mt-1'>
                                Uploading image...
                              </p>
                            )}
                          </div>

                          <div className='md:col-span-2'>
                            <label className='block text-sm font-medium mb-1'>
                              Bio *
                            </label>
                            <textarea
                              value={member.bio}
                              onChange={(e) =>
                                updateTeamMember(index, 'bio', e.target.value)
                              }
                              rows={3}
                              className='w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
                              placeholder='Brief description of the team member...'
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {aboutData?.team?.map((member, index) => (
                      <div
                        key={index}
                        className='bg-background/50 border border-border rounded-lg p-4'
                      >
                        <div className='flex items-center space-x-3 mb-3'>
                          <div className='w-12 h-12 bg-[hsl(var(--primary))]/20 rounded-full flex items-center justify-center'>
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.name}
                                className='w-12 h-12 rounded-full object-cover'
                              />
                            ) : (
                              <Users className='w-6 h-6 text-primary' />
                            )}
                          </div>
                          <div>
                            <h4 className='font-semibold'>{member.name}</h4>
                            <p className='text-sm text-muted-foreground'>
                              {member.role}
                            </p>
                          </div>
                        </div>
                        <div className='space-y-2 text-sm'>
                          <p className='text-primary font-medium'>
                            {member.experience} • {member.specialization}
                          </p>
                          <p className='text-muted-foreground line-clamp-3'>
                            {member.bio}
                          </p>
                        </div>
                      </div>
                    )) || (
                      <div className='col-span-full text-center py-8 text-muted-foreground'>
                        No team members added yet
                      </div>
                    )}
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
