import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Gallery from '@/models/Gallery'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const gallery = await Gallery.findById(id)

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: gallery })
  } catch (error) {
    console.error('Error fetching gallery item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery item' },
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

    const gallery = await Gallery.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: gallery })
  } catch (error) {
    console.error('Error updating gallery item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery item' },
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
    const gallery = await Gallery.findByIdAndDelete(id)

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery item deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery item' },
      { status: 500 },
    )
  }
}
