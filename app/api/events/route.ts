import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Event from '@/models/Event'

// GET - Fetch all events (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const pkg = searchParams.get('package')

    const filter: Record<string, unknown> = {}
    if (pkg) filter.package = pkg

    const events = await Event.find(filter).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      data: events,
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch events' },
      { status: 500 },
    )
  }
}
