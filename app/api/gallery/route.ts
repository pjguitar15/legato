import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Gallery from '@/models/Gallery'

// GET - Fetch all gallery items (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get all gallery items from database
    const galleryItems = await Gallery.find({}).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      data: galleryItems,
    })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch gallery' },
      { status: 500 },
    )
  }
}
