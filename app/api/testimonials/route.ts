import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'

// GET - Fetch all testimonials (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get all testimonials from database
    const testimonials = await Testimonial.find({})
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: testimonials,
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonials' },
      { status: 500 },
    )
  }
}
