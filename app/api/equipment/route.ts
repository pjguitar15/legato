import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import EquipmentCategory from '@/models/Equipment'

// GET - Fetch all equipment categories (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get all equipment categories from database
    const categories = await EquipmentCategory.find({})
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch equipment' },
      { status: 500 },
    )
  }
}
