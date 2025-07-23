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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}
    if (status && status !== 'all') {
      filter.status = status
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
      notes,
    } = body

    // Validate required fields
    if (
      !eventType ||
      !eventDate ||
      !clientName ||
      !agreedAmount ||
      !packageName ||
      !eventTime ||
      !ingress ||
      !location ||
      !mixerAndSpeaker
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      )
    }

    const booking = new EventBooking({
      status: status || 'pending',
      eventType,
      eventDate: new Date(eventDate),
      crew: crew || [],
      clientName,
      agreedAmount: parseFloat(agreedAmount),
      package: packageName,
      eventTime,
      ingress,
      expenses: parseFloat(expenses || 0),
      location,
      mixerAndSpeaker,
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
