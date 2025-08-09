import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import FAQ from '@/models/FAQ'

// GET - Fetch all FAQs (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get all FAQs from database
    const faqs = await FAQ.find({}).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      data: faqs,
    })
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch FAQs' },
      { status: 500 },
    )
  }
}
