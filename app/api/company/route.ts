import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Company from '@/models/Company'

// GET - Fetch company information (public endpoint)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get company information from database
    const company = await Company.findOne({}).lean()

    return NextResponse.json({
      success: true,
      data: company,
    })
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch company information' },
      { status: 500 },
    )
  }
}
