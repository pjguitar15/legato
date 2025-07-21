import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import EquipmentCategory from '@/models/Equipment'

export async function GET() {
  try {
    await connectToDatabase()
    const equipment = await EquipmentCategory.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: equipment })
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const equipment = new EquipmentCategory(body)
    await equipment.save()

    return NextResponse.json(
      { success: true, data: equipment },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating equipment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create equipment' },
      { status: 500 },
    )
  }
}
