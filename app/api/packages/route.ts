import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Package from '@/models/Package'

// GET - Fetch all packages (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get all packages from database
    const packages = await Package.find({}).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      data: packages,
    })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch packages' },
      { status: 500 },
    )
  }
}
