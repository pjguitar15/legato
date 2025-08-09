import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import About from '@/models/About'

// GET - Fetch about information (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get about information from database
    const about = await About.findOne({}).lean()

    return NextResponse.json({
      success: true,
      data: about,
    })
  } catch (error) {
    console.error('Error fetching about:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch about information' },
      { status: 500 },
    )
  }
}
