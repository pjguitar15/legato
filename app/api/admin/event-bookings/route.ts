import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import EventBooking from '@/models/EventBooking'
import { verifyAuthRequest } from '@/lib/auth-server'

// GET - Fetch all event bookings
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const hideCompleted = searchParams.get('hideCompleted') === 'true'
    const hideCancelled = searchParams.get('hideCancelled') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20') // Show 20 per page initially
    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}
    if (status && status !== 'all') {
      filter.status = status
    }

    // Hide completed events if requested
    if (hideCompleted) {
      filter.status = { $ne: 'completed' }
    }

    // Hide cancelled events if requested
    if (hideCancelled) {
      filter.status = { $ne: 'cancelled' }
    }

    // Handle both hide completed and hide cancelled
    if (hideCompleted && hideCancelled) {
      filter.status = { $nin: ['completed', 'cancelled'] }
    }

    // Get total count
    const total = await EventBooking.countDocuments(filter)

    // Get bookings with pagination
    const bookings = await EventBooking.find(filter)
      .sort({ eventDate: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    })
  } catch (error) {
    console.error('Error fetching event bookings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch event bookings' },
      { status: 500 },
    )
  }
}

// POST - Create new event booking
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
    const {
      status,
      eventType,
      eventDate,
      crew,
      clientName,
      agreedAmount,
      package: packageName,
      eventTime,
      ingress,
      expenses,
      location,
      mixerAndSpeaker,
      driver,
      notes,
    } = body

    // All fields are optional - no validation required
    const booking = new EventBooking({
      status: status || 'pending',
      eventType: eventType || '',
      eventDate: eventDate ? new Date(eventDate) : new Date(),
      crew: crew || [],
      clientName: clientName || '',
      agreedAmount: parseFloat(agreedAmount || 0),
      package: packageName || '',
      eventTime: eventTime || '',
      ingress: ingress || '',
      expenses: parseFloat(expenses || 0),
      location: location || '',
      mixerAndSpeaker: mixerAndSpeaker || '',
      driver: driver || '',
      notes: notes || '',
    })

    await booking.save()

    return NextResponse.json({
      success: true,
      message: 'Event booking created successfully',
      data: booking,
    })
  } catch (error) {
    console.error('Error creating event booking:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create event booking' },
      { status: 500 },
    )
  }
}
