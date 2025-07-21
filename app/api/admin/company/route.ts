import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Company from '@/models/Company'

export async function GET() {
  try {
    await connectToDatabase()
    const company = await Company.findOne()
    return NextResponse.json({ success: true, data: company })
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    // Delete existing company info first (since there should only be one)
    await Company.deleteMany({})

    const company = new Company(body)
    await company.save()

    return NextResponse.json({ success: true, data: company }, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create company' },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const company = await Company.findOneAndUpdate({}, body, {
      new: true,
      runValidators: true,
      upsert: true,
    })

    return NextResponse.json({ success: true, data: company })
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update company' },
      { status: 500 },
    )
  }
}
