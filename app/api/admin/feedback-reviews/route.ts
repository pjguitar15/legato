import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import FeedbackReview from '@/models/FeedbackReview'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    await connectToDatabase()
    const feedbackReviews = await FeedbackReview.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: feedbackReviews })
  } catch (error) {
    console.error('Error fetching feedback reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback reviews' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    // Generate unique ID for the feedback link
    const uniqueId = uuidv4()

    const feedbackReview = new FeedbackReview({
      ...body,
      uniqueId,
    })
    await feedbackReview.save()

    return NextResponse.json(
      { success: true, data: feedbackReview },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating feedback review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create feedback review' },
      { status: 500 },
    )
  }
} 