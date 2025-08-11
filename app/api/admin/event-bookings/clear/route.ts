import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import EventBooking from '@/models/EventBooking'
import { verifyAuthRequest } from '@/lib/auth-server'

// Convenience endpoint to clear all bookings via GET while authenticated
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
    const result = await EventBooking.deleteMany({})

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount || 0} event bookings`,
      deletedCount: result.deletedCount || 0,
    })
  } catch (error) {
    console.error('Error clearing event bookings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to clear event bookings' },
      { status: 500 },
    )
  }
}
