import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { verifyAuthRequest } from '@/lib/auth-server'

// Simple in-memory storage for amount options (in production, use a database)
let amountOptionsList: string[] = [
  '1000',
  '2000',
  '3000',
  '4000',
  '5000',
  '6000',
  '7000',
  '8000',
  '9000',
  '10000',
  '15000',
  '20000',
  '25000',
  '30000',
  '40000',
  '50000',
  '75000',
  '100000',
]

// GET - Fetch all amount options
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

    return NextResponse.json({
      success: true,
      data: amountOptionsList,
    })
  } catch (error) {
    console.error('Error fetching amount options:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch amount options' },
      { status: 500 },
    )
  }
}

// POST - Add new amount option
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuthRequest(request)
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: 'Amount option is required' },
        { status: 400 },
      )
    }

    // Add to in-memory list
    if (!amountOptionsList.includes(body.name)) {
      amountOptionsList.push(body.name)
    }

    return NextResponse.json({
      success: true,
      message: 'Amount option added successfully',
      data: { name: body.name },
    })
  } catch (error) {
    console.error('Error adding amount option:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add amount option' },
      { status: 500 },
    )
  }
}
