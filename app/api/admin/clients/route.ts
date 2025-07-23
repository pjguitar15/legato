import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Client from '@/models/Client'
import { verifyAuthRequest } from '@/lib/auth-server'

// Predefined recurring clients
const PREDEFINED_CLIENTS = ['The Feast', 'NGIS']

// GET - Fetch all clients (predefined + custom)
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

    // Get custom clients from database
    const customClients = await Client.find({}).sort({ name: 1 }).lean()

    // Combine predefined and custom clients
    const allClients = [
      ...PREDEFINED_CLIENTS,
      ...customClients.map((client) => client.name),
    ]

    return NextResponse.json({
      success: true,
      data: allClients,
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch clients' },
      { status: 500 },
    )
  }
}

// POST - Add new custom client
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
        { success: false, message: 'Client name is required' },
        { status: 400 },
      )
    }

    const trimmedName = name.trim()
    if (!trimmedName) {
      return NextResponse.json(
        { success: false, message: 'Client name cannot be empty' },
        { status: 400 },
      )
    }

    // Check if it's already a predefined client
    if (PREDEFINED_CLIENTS.includes(trimmedName)) {
      return NextResponse.json({
        success: true,
        message: 'Client already exists',
        data: { name: trimmedName },
      })
    }

    // Check if custom client already exists
    const existingClient = await Client.findOne({ name: trimmedName })
    if (existingClient) {
      return NextResponse.json({
        success: true,
        message: 'Client already exists',
        data: existingClient,
      })
    }

    // Create new custom client
    const client = new Client({ name: trimmedName })
    await client.save()

    return NextResponse.json({
      success: true,
      message: 'Client added successfully',
      data: client,
    })
  } catch (error) {
    console.error('Error adding client:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add client' },
      { status: 500 },
    )
  }
}
