import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Event from '@/models/Event'

// GET all events
export async function GET() {
  try {
    await connectToDatabase()
    const events = await Event.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: events })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 },
    )
  }
}

// POST create new event
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const event = new Event(body)
    await event.save()

    return NextResponse.json({ success: true, data: event }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 },
    )
  }
}
