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

    const testimonial = await Testimonial.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: testimonial })
  } catch (error) {
    console.error('Error updating testimonial:', error)
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
