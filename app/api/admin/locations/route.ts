import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Location from '@/models/Location'
import { verifyAuthRequest } from '@/lib/auth-server'

// Predefined locations
const PREDEFINED_LOCATIONS = [
  'Manila',
  'Quezon City',
  'Makati',
  'Taguig',
  'Pasig',
  'Marikina',
  'Caloocan',
  'Las Piñas',
  'Parañaque',
  'Muntinlupa',
  'Valenzuela',
  'Malabon',
  'Navotas',
  'San Juan',
  'Mandaluyong',
  'Pasay',
  'Pateros',
]

// GET - Fetch all locations (predefined + custom)
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuthRequest(request)
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    await connectToDatabase()

    // Get custom locations from database
    const customLocations = await Location.find({})
      .sort({ name: 1 })
      .lean()

    // Combine predefined and custom locations
    const allLocations = [
      ...PREDEFINED_LOCATIONS,
      ...customLocations.map((location) => location.name),
    ]

    return NextResponse.json({
      success: true,
      data: allLocations,
    })
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch locations' },
      { status: 500 },
    )
  }
}

// POST - Add new custom location
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuthRequest(request)
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    await connectToDatabase()

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Location name is required' },
        { status: 400 },
      )
    }

    const trimmedName = name.trim()
    if (!trimmedName) {
      return NextResponse.json(
        { success: false, message: 'Location name cannot be empty' },
        { status: 400 },
      )
    }

    // Check if it's already a predefined location
    if (PREDEFINED_LOCATIONS.includes(trimmedName)) {
      return NextResponse.json({
        success: true,
        message: 'Location already exists',
        data: { name: trimmedName },
      })
    }

    // Check if custom location already exists
    const existingLocation = await Location.findOne({ name: trimmedName })
    if (existingLocation) {
      return NextResponse.json({
        success: true,
        message: 'Location already exists',
        data: existingLocation,
      })
    }

    // Create new custom location
    const location = new Location({ name: trimmedName })
    await location.save()

    return NextResponse.json({
      success: true,
      message: 'Location added successfully',
      data: location,
    })
  } catch (error) {
    console.error('Error adding location:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add location' },
      { status: 500 },
    )
  }
} 