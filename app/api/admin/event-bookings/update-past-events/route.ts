import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import EventBooking from '@/models/EventBooking'
import { verifyAuthRequest } from '@/lib/auth-server'

// POST - Update past confirmed events to completed
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

    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for comparison

    // Find all past events (regardless of status) that should be marked as completed
    const pastEvents = await EventBooking.find({
      status: { $nin: ['completed', 'cancelled'] }, // Exclude already completed/cancelled
      eventDate: { $lt: today },
    })

    if (pastEvents.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No past events found to update',
        updatedCount: 0,
      })
    }

    // Update all past events to completed
    const updateResult = await EventBooking.updateMany(
      {
        status: { $nin: ['completed', 'cancelled'] }, // Exclude already completed/cancelled
        eventDate: { $lt: today },
      },
      {
        $set: { status: 'completed' },
      },
    )

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updateResult.modifiedCount} events from confirmed to completed`,
      updatedCount: updateResult.modifiedCount,
    })
  } catch (error) {
    console.error('Error updating past events:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update past events' },
      { status: 500 },
    )
  }
}
