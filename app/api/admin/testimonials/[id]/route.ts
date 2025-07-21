import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const testimonial = await Testimonial.findById(id)

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: testimonial })
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonial' },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase()
    const { id } = await params
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
      '📝 Updating testimonial with cleaned data:',
      JSON.stringify(cleanedBody, null, 2),
    )

    const testimonial = await Testimonial.findByIdAndUpdate(id, cleanedBody, {
      new: true,
      runValidators: true,
    })

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 },
      )
    }

    console.log('✅ Testimonial updated successfully:', testimonial._id)
    return NextResponse.json({ success: true, data: testimonial })
  } catch (error) {
    console.error('❌ Error updating testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const testimonial = await Testimonial.findByIdAndDelete(id)

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 },
    )
  }
}
