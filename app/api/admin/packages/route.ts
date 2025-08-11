import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Package from '@/models/Package'
import { verifyAuthRequest } from '@/lib/auth-server'

// GET - Fetch all packages
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

    // Get all packages from database
    const packages = await Package.find({}).sort({ createdAt: -1 }).lean()

    return NextResponse.json({
      success: true,
      data: packages,
    })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch packages' },
      { status: 500 },
    )
  }
}

// POST - Create new package
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
    const requiredFields = [
      'name',
      'description',
      'price',
      'idealFor',
      'maxGuests',
    ]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 },
        )
      }
    }

    // Create new package
    const pkg = new Package({
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      currency: body.currency || '₱',
      features: body.features || [],
      equipment: Array.isArray(body.equipment) ? body.equipment : [],
      idealFor: body.idealFor,
      maxGuests: parseInt(body.maxGuests),
      popular: body.popular || false,
      image: body.image || '',
      recommendedEvents: body.recommendedEvents || [],
    })

    await pkg.save()

    return NextResponse.json({
      success: true,
      message: 'Package created successfully',
      data: pkg,
    })
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create package' },
      { status: 500 },
    )
  }
}
