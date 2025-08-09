'use client'

import { useState, useEffect } from 'react'

interface CompanyData {
  _id?: string
  name: string
  tagline: string
  description: string
  coverage: string
  footerDescription: string
  logo?: string
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
    messenger?: string
    instagram?: string
    youtube?: string
    facebookPageId?: string
  }
  businessHours: {
    weekdays: string
    weekends: string
    holidays: string
  }
  stats: { value: string; label: string }[]
  serviceAreas: string[]
  founded: number
}

export function useCompanyData() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCompanyData()
  }, [])

  const fetchCompanyData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/company')
      const data = await response.json()

      if (data.success && data.data) {
        setCompanyData(data.data)
      } else {
        // Fallback to default data if no company data found
        setCompanyData({
          name: 'Legato Sounds and Lights',
          tagline: 'Professional Live Sound & Stage Lighting',
          description:
            'Premium live sound engineering and stage lighting for concerts and events.',
          coverage:
            'Serving Rock Bands & Live Music Events - Cavite, Metro Manila, and Nearby Areas',
          footerDescription:
            'Premium live sound engineering and stage lighting, concerts, and high-energy events across Cavite, Metro Manila, and nearby areas.',
          contact: {
            address: 'Trece Martires City',
            city: 'Trece Martires',
            province: 'Cavite',
            zipCode: '4109',
            phone: '09762737247',
            email: 'info@legatosounds.com',
          },
          socialMedia: {
            facebook: 'https://www.facebook.com/legatosoundsandlightsrental',
            messenger: 'https://www.facebook.com/legatosoundsandlightsrental',
            youtube: 'https://www.youtube.com/@LegatoSoundsandLights',
            facebookPageId: 'legatosoundsandlightsrental',
          },
          businessHours: {
            weekdays: '9:00 AM - 6:00 PM',
            weekends: '10:00 AM - 4:00 PM',
            holidays: 'By appointment only',
          },
          serviceAreas: ['Cavite Province', 'Metro Manila', 'Nearby Areas'],
          founded: 2022,
          stats: [
            { value: '500+', label: 'Live Shows' },
            { value: '3+', label: 'Years Of Service' },
            { value: '5.0⭐', label: 'Service Rating' },
          ],
        })
      }
    } catch (error) {
      console.error('Error fetching company data:', error)
      setError('Failed to load company data')

      // Set fallback data on error
      setCompanyData({
        name: 'Legato Sounds and Lights',
        tagline: 'Professional Live Sound & Stage Lighting',
        description:
          'Premium live sound engineering and stage lighting for concerts and events.',
        coverage:
          'Serving Rock Bands & Live Music Events - Cavite, Metro Manila, and Nearby Areas',
        footerDescription:
          'Premium live sound engineering and stage lighting, concerts, and high-energy events across Cavite, Metro Manila, and nearby areas.',
        contact: {
          address: 'Trece Martires City',
          city: 'Trece Martires',
          province: 'Cavite',
          zipCode: '4109',
          phone: '09762737247',
          email: 'info@legatosounds.com',
        },
        socialMedia: {
          facebook: 'https://www.facebook.com/legatosoundsandlightsrental',
          messenger: 'https://www.facebook.com/legatosoundsandlightsrental',
          youtube: 'https://www.youtube.com/@LegatoSoundsandLights',
          facebookPageId: 'legatosoundsandlightsrental',
        },
        businessHours: {
          weekdays: '9:00 AM - 6:00 PM',
          weekends: '10:00 AM - 4:00 PM',
          holidays: 'By appointment only',
        },
        serviceAreas: ['Cavite Province', 'Metro Manila', 'Nearby Areas'],
        founded: 2022,
        stats: [
          { value: '500+', label: 'Live Shows' },
          { value: '3+', label: 'Years Of Service' },
          { value: '5.0⭐', label: 'Service Rating' },
        ],
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { companyData, isLoading, error, refetch: fetchCompanyData }
}
