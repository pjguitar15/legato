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

    // Clean the body data to handle image field properly
    const cleanedBody = { ...body }

    // Handle image field - convert empty object to empty string
    if (
      cleanedBody.image &&
      typeof cleanedBody.image === 'object' &&
      Object.keys(cleanedBody.image).length === 0
    ) {
      cleanedBody.image = ''
    }

    // Remove any undefined or null values that might cause issues
    Object.keys(cleanedBody).forEach((key) => {
      if (cleanedBody[key] === undefined || cleanedBody[key] === null) {
        delete cleanedBody[key]
      }
    })

    console.log(
      '📝 Creating testimonial with cleaned data:',
      JSON.stringify(cleanedBody, null, 2),
    )

    const testimonial = new Testimonial(cleanedBody)
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
