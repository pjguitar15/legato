import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import FeedbackReview from '@/models/FeedbackReview'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const feedbackReview = await FeedbackReview.findById(id)

    if (!feedbackReview) {
      return NextResponse.json(
        { success: false, error: 'Feedback review not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: feedbackReview })
  } catch (error) {
    console.error('Error fetching feedback review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback review' },
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

    const feedbackReview = await FeedbackReview.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!feedbackReview) {
      return NextResponse.json(
        { success: false, error: 'Feedback review not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: feedbackReview })
  } catch (error) {
    console.error('Error updating feedback review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update feedback review' },
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
    const feedbackReview = await FeedbackReview.findByIdAndDelete(id)

    if (!feedbackReview) {
      return NextResponse.json(
        { success: false, error: 'Feedback review not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback review deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting feedback review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete feedback review' },
      { status: 500 },
    )
  }
}
