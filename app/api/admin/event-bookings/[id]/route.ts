import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import EventBooking from '@/models/EventBooking'
import { verifyAuthRequest } from '@/lib/auth-server'

// GET - Fetch single event booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    const authResult = await verifyAuthRequest(request)
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    await connectToDatabase()

    const booking = await EventBooking.findById(id).lean()

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Event booking not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error('Error fetching event booking:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch event booking' },
      { status: 500 },
    )
  }
}

// PUT - Update event booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

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
    const updatedBooking = await EventBooking.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true, runValidators: false }, // Disable validators since fields are optional
    )

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, message: 'Event booking not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Event booking updated successfully',
      data: updatedBooking,
    })
  } catch (error) {
    console.error('Error updating event booking:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update event booking' },
      { status: 500 },
    )
  }
}

// DELETE - Delete event booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    const authResult = await verifyAuthRequest(request)
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    await connectToDatabase()

    const deletedBooking = await EventBooking.findByIdAndDelete(id)

    if (!deletedBooking) {
      return NextResponse.json(
        { success: false, message: 'Event booking not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Event booking deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting event booking:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete event booking' },
      { status: 500 },
    )
  }
}
