import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import EquipmentCategory from '@/models/Equipment'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase()
    const { id } = await params
    const equipment = await EquipmentCategory.findById(id)

    if (!equipment) {
      return NextResponse.json(
        { success: false, error: 'Equipment not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: equipment })
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment' },
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

    const equipment = await EquipmentCategory.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!equipment) {
      return NextResponse.json(
        { success: false, error: 'Equipment not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: equipment })
  } catch (error) {
    console.error('Error updating equipment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update equipment' },
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
    const equipment = await EquipmentCategory.findByIdAndDelete(id)

    if (!equipment) {
      return NextResponse.json(
        { success: false, error: 'Equipment not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Equipment deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting equipment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete equipment' },
      { status: 500 },
    )
  }
}
