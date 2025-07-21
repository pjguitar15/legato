import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Package from '@/models/Package'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const pkg = await Package.findById(id)

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: pkg })
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch package' },
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

    const pkg = await Package.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: pkg })
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update package' },
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
    const pkg = await Package.findByIdAndDelete(id)

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete package' },
      { status: 500 },
    )
  }
}
