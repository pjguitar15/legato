import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { verifyAuthRequest } from '@/lib/auth-server'
import EventBooking from '@/models/EventBooking' // Added missing import

// Simple in-memory storage for drivers (in production, use a database)
let driversList: string[] = []

// GET - Fetch all drivers
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

    // Get unique drivers from existing bookings
    const bookings = await EventBooking.find({}).select('driver').lean()
    const existingDrivers = bookings
      .map((booking) => booking.driver)
      .filter((driver) => driver && driver.trim() !== '')
      .filter((driver, index, arr) => arr.indexOf(driver) === index) // Remove duplicates

    // Combine existing drivers with added drivers
    const allDrivers = [...new Set([...existingDrivers, ...driversList])]

    return NextResponse.json({
      success: true,
      data: allDrivers,
    })
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch drivers' },
      { status: 500 },
    )
  }
}

// POST - Add new driver
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuthRequest(request)
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: 'Driver name is required' },
        { status: 400 },
      )
    }

    // Add to in-memory list
    if (!driversList.includes(body.name)) {
      driversList.push(body.name)
    }

    return NextResponse.json({
      success: true,
      message: 'Driver added successfully',
      data: { name: body.name },
    })
  } catch (error) {
    console.error('Error adding driver:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add driver' },
      { status: 500 },
    )
  }
}
