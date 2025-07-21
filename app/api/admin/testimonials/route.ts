import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'

export async function GET() {
  try {
    await connectToDatabase()
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: testimonials })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const testimonial = new Testimonial(body)
    await testimonial.save()

    return NextResponse.json(
      { success: true, data: testimonial },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 },
    )
  }
}
