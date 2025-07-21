'use client'

import { useEffect, useState } from 'react'
import { Edit, Save, Users } from 'lucide-react'
import AuthGuard from '@/components/admin/auth-guard'

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
    description: string
    image?: string
  }[]
}

export default function AboutAdmin() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
        description: '',
        image: '',
      },
    ],
  })

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/about')
      const data = await response.json()

      if (data.success && data.data) {
        setAboutData(data.data)
        setFormData(data.data)
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
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
        { name: '', role: '', description: '', image: '' },
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
              className='bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2'
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
                className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
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
                        {aboutData?.experience.years}+
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
                        {aboutData?.experience.events}+
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
                        {aboutData?.experience.clients}+
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
                    {aboutData?.values.map((value, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-primary/20 text-primary rounded-full text-sm'
                      >
                        {value}
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
