import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import EventType from '@/models/EventType'
import { verifyAuthRequest } from '@/lib/auth-server'

// Predefined event types
const PREDEFINED_EVENT_TYPES = [
  'Wedding',
  'Birthday Party',
  'Corporate Event',
  'Concert',
  'Conference',
  'Graduation',
  'Anniversary',
  'Product Launch',
  'Trade Show',
  'Seminar',
  'Workshop',
  'Gala Dinner',
  'Award Ceremony',
  'Team Building',
  'Holiday Party',
  'Charity Event',
  'Music Festival',
  'Sports Event',
  'Religious Ceremony',
  'Political Rally',
]

// GET - Fetch all event types (predefined + custom)
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

    // Get custom event types from database
    const customEventTypes = await EventType.find({})
      .sort({ name: 1 })
      .lean()

    // Combine predefined and custom event types
    const allEventTypes = [
      ...PREDEFINED_EVENT_TYPES,
      ...customEventTypes.map((et) => et.name),
    ]

    return NextResponse.json({
      success: true,
      data: allEventTypes,
    })
  } catch (error) {
    console.error('Error fetching event types:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch event types' },
      { status: 500 },
    )
  }
}

// POST - Add new custom event type
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
        { success: false, message: 'Event type name is required' },
        { status: 400 },
      )
    }

    const trimmedName = name.trim()
    if (!trimmedName) {
      return NextResponse.json(
        { success: false, message: 'Event type name cannot be empty' },
        { status: 400 },
      )
    }

    // Check if it's already a predefined type
    if (PREDEFINED_EVENT_TYPES.includes(trimmedName)) {
      return NextResponse.json({
        success: true,
        message: 'Event type already exists',
        data: { name: trimmedName },
      })
    }

    // Check if custom type already exists
    const existingType = await EventType.findOne({ name: trimmedName })
    if (existingType) {
      return NextResponse.json({
        success: true,
        message: 'Event type already exists',
        data: existingType,
      })
    }

    // Create new custom event type
    const eventType = new EventType({ name: trimmedName })
    await eventType.save()

    return NextResponse.json({
      success: true,
      message: 'Event type added successfully',
      data: eventType,
    })
  } catch (error) {
    console.error('Error adding event type:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add event type' },
      { status: 500 },
    )
  }
} 