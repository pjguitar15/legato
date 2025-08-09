import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { verifyAuthRequest } from '@/lib/auth-server'

// Simple in-memory storage for time options (in production, use a database)
let timeOptionsList: string[] = []

// GET - Fetch all time options
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
      data: timeOptionsList,
    })
  } catch (error) {
    console.error('Error fetching time options:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch time options' },
      { status: 500 },
    )
  }
}

// POST - Add new time option
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
        { success: false, message: 'Time option is required' },
        { status: 400 },
      )
    }

    // Add to in-memory list
    if (!timeOptionsList.includes(body.name)) {
      timeOptionsList.push(body.name)
    }

    return NextResponse.json({
      success: true,
      message: 'Time option added successfully',
      data: { name: body.name },
    })
  } catch (error) {
    console.error('Error adding time option:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add time option' },
      { status: 500 },
    )
  }
}
