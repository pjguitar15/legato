import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Gallery from '@/models/Gallery'

export async function GET() {
  try {
    await connectToDatabase()
    const gallery = await Gallery.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: gallery })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const galleryItem = new Gallery(body)
    await galleryItem.save()

    return NextResponse.json(
      { success: true, data: galleryItem },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating gallery item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create gallery item' },
      { status: 500 },
    )
  }
}
