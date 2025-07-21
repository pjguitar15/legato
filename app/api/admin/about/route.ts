import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import About from '@/models/About'

export async function GET() {
  try {
    await connectToDatabase()
    const about = await About.findOne()
    return NextResponse.json({ success: true, data: about })
  } catch (error) {
    console.error('Error fetching about:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    // Delete existing about info first (since there should only be one)
    await About.deleteMany({})

    const about = new About(body)
    await about.save()

    return NextResponse.json({ success: true, data: about }, { status: 201 })
  } catch (error) {
    console.error('Error creating about:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create about' },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const about = await About.findOneAndUpdate({}, body, {
      new: true,
      runValidators: true,
      upsert: true,
    })

    return NextResponse.json({ success: true, data: about })
  } catch (error) {
    console.error('Error updating about:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update about' },
      { status: 500 },
    )
  }
}
