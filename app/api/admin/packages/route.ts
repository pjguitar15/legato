import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Package from '@/models/Package'

// GET all packages
export async function GET() {
  try {
    await connectToDatabase()
    const packages = await Package.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: packages })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch packages' },
      { status: 500 },
    )
  }
}

// POST create new package
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const packageItem = new Package(body)
    await packageItem.save()

    return NextResponse.json(
      { success: true, data: packageItem },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create package' },
      { status: 500 },
    )
  }
}
