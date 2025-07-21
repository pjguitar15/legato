import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import FAQ from '@/models/FAQ'

export async function GET() {
  try {
    await connectToDatabase()
    const faqs = await FAQ.find({}).sort({ order: 1, createdAt: -1 })
    return NextResponse.json({ success: true, data: faqs })
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQs' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const faq = new FAQ(body)
    await faq.save()

    return NextResponse.json({ success: true, data: faq }, { status: 201 })
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create FAQ' },
      { status: 500 },
    )
  }
}
