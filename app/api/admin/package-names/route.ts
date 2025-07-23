import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Package from '@/models/Package'
import { verifyAuthRequest } from '@/lib/auth-server'

// Predefined package names
const PREDEFINED_PACKAGE_NAMES = ['Basic Setup', 'Full Band Setup']

// GET - Fetch all package names (predefined + custom)
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

    // Get custom package names from database
    const customPackages = await Package.find({})
      .select('name')
      .sort({ name: 1 })
      .lean()

    // Combine predefined and custom package names, removing duplicates
    const allPackageNames = [
      ...PREDEFINED_PACKAGE_NAMES,
      ...customPackages.map((pkg) => pkg.name),
    ].filter((name, index, array) => array.indexOf(name) === index)

    return NextResponse.json({
      success: true,
      data: allPackageNames,
    })
  } catch (error) {
    console.error('Error fetching package names:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch package names' },
      { status: 500 },
    )
  }
}

// POST - Add new custom package name
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
    const { name } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Package name is required' },
        { status: 400 },
      )
    }

    const trimmedName = name.trim()
    if (!trimmedName) {
      return NextResponse.json(
        { success: false, message: 'Package name cannot be empty' },
        { status: 400 },
      )
    }

    // Check if it's already a predefined package name
    if (PREDEFINED_PACKAGE_NAMES.includes(trimmedName)) {
      return NextResponse.json({
        success: true,
        message: 'Package name already exists',
        data: { name: trimmedName },
      })
    }

    // Check if custom package name already exists
    const existingPackage = await Package.findOne({ name: trimmedName })
    if (existingPackage) {
      return NextResponse.json({
        success: true,
        message: 'Package name already exists',
        data: existingPackage,
      })
    }

    // Create new custom package with default values
    const pkg = new Package({
      name: trimmedName,
      description: `${trimmedName} package`,
      price: 0,
      currency: '₱',
      features: [],
      equipment: [],
      idealFor: 'Events',
      maxGuests: 100,
      popular: false,
    })
    await pkg.save()

    return NextResponse.json({
      success: true,
      message: 'Package name added successfully',
      data: pkg,
    })
  } catch (error) {
    console.error('Error adding package name:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add package name' },
      { status: 500 },
    )
  }
}
