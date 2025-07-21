import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import FAQ from '@/models/FAQ'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const faq = await FAQ.findById(id)

    if (!faq) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: faq })
  } catch (error) {
    console.error('Error fetching FAQ:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FAQ' },
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

    const faq = await FAQ.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!faq) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: faq })
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update FAQ' },
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
    const faq = await FAQ.findByIdAndDelete(id)

    if (!faq) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete FAQ' },
      { status: 500 },
    )
  }
}
