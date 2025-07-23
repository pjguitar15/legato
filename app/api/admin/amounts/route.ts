import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Amount from '@/models/Amount'
import { verifyAuthRequest } from '@/lib/auth-server'

// Predefined common amounts
const PREDEFINED_AMOUNTS = [
  1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000,
  7500, 8000, 8500, 9000, 9500, 10000, 12000, 15000, 18000, 20000, 25000, 30000,
  35000, 40000, 45000, 50000,
]

// GET - Fetch all amounts (predefined + custom)
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

    // Get custom amounts from database
    const customAmounts = await Amount.find({}).sort({ value: 1 }).lean()

    // Combine predefined and custom amounts
    const allAmounts = [
      ...PREDEFINED_AMOUNTS,
      ...customAmounts.map((amount) => amount.value),
    ]

    // Remove duplicates and sort
    const uniqueAmounts = [...new Set(allAmounts)].sort((a, b) => a - b)

    return NextResponse.json({
      success: true,
      data: uniqueAmounts,
    })
  } catch (error) {
    console.error('Error fetching amounts:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch amounts' },
      { status: 500 },
    )
  }
}

// POST - Add new custom amount
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
    const { value } = body

    if (!value || typeof value !== 'number') {
      return NextResponse.json(
        {
          success: false,
          message: 'Amount value is required and must be a number',
        },
        { status: 400 },
      )
    }

    if (value <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be greater than 0' },
        { status: 400 },
      )
    }

    // Check if it's already a predefined amount
    if (PREDEFINED_AMOUNTS.includes(value)) {
      return NextResponse.json({
        success: true,
        message: 'Amount already exists',
        data: { value },
      })
    }

    // Check if custom amount already exists
    const existingAmount = await Amount.findOne({ value })
    if (existingAmount) {
      return NextResponse.json({
        success: true,
        message: 'Amount already exists',
        data: existingAmount,
      })
    }

    // Create new custom amount
    const amount = new Amount({ value })
    await amount.save()

    return NextResponse.json({
      success: true,
      message: 'Amount added successfully',
      data: amount,
    })
  } catch (error) {
    console.error('Error adding amount:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add amount' },
      { status: 500 },
    )
  }
}
