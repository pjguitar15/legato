import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import FeedbackReview from '@/models/FeedbackReview'
import Testimonial from '@/models/Testimonial'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uniqueId: string }> },
) {
  try {
    await connectToDatabase()
    const { uniqueId } = await params
    const feedbackReview = await FeedbackReview.findOne({ uniqueId })

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uniqueId: string }> },
) {
  try {
    await connectToDatabase()
    const { uniqueId } = await params
    const body = await request.json()

    const feedbackReview = await FeedbackReview.findOneAndUpdate(
      { uniqueId },
      {
        rating: body.rating,
        feedback: body.feedback,
        status: 'completed',
        submittedAt: new Date(),
      },
      { new: true, runValidators: true },
    )

    if (!feedbackReview) {
      return NextResponse.json(
        { success: false, error: 'Feedback review not found' },
        { status: 404 },
      )
    }

    // Create a testimonial from the feedback
    try {
      const testimonial = new Testimonial({
        name: feedbackReview.customerName,
        event: feedbackReview.eventType,
        date: feedbackReview.date,
        rating: body.rating,
        feedback: body.feedback,
        location: feedbackReview.location,
        image: body.image || '', // Include the uploaded image URL
      })

      await testimonial.save()
      console.log('✅ Testimonial created from feedback:', testimonial._id)
    } catch (error) {
      console.error('❌ Error creating testimonial from feedback:', error)
      // Don't fail the feedback submission if testimonial creation fails
    }

    return NextResponse.json({ success: true, data: feedbackReview })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 },
    )
  }
}
