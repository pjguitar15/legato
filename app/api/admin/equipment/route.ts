import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import EquipmentCategory from '@/models/Equipment'
import { verifyAuthRequest } from '@/lib/auth-server'

// GET - Fetch all equipment categories
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuthRequest(request)
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

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

// POST - Create new equipment category
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuthRequest(request)
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    await connectToDatabase()

    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 },
      )
    }

    // Create new equipment category
    const category = new EquipmentCategory({
      name: body.name,
      items: body.items || [],
    })

    await category.save()

    return NextResponse.json({
      success: true,
      message: 'Equipment category created successfully',
      data: category,
    })
  } catch (error) {
    console.error('Error creating equipment category:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create equipment category' },
      { status: 500 },
    )
  }
}
