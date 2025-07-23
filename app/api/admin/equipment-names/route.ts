import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import EquipmentCategory from '@/models/Equipment'
import { verifyAuthRequest } from '@/lib/auth-server'

// Predefined equipment names
const PREDEFINED_EQUIPMENT_NAMES = [
  'RCF 745A + Allen & Heath SQ5',
  'RCF 745A + Behringer X32',
  'RCF 745A + Yamaha CL5',
  'RCF 745A + Midas M32',
  'RCF 745A + Soundcraft Vi1',
  'RCF 745A + Allen & Heath dLive',
  'RCF 745A + Digico SD9',
  'RCF 745A + Avid Venue',
  'RCF 745A + PreSonus StudioLive',
  'RCF 745A + Mackie DL32R',
  'RCF 745A + Behringer Wing',
  'RCF 745A + Allen & Heath QU-32',
  'RCF 745A + Yamaha QL5',
  'RCF 745A + Midas Pro2',
  'RCF 745A + Soundcraft Si Expression',
]

// GET - Fetch all equipment names (predefined + custom)
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

    // Get custom equipment names from database
    const customEquipment = await EquipmentCategory.find({})
      .select('items.name')
      .sort({ name: 1 })
      .lean()

    // Extract equipment names from all categories
    const customEquipmentNames = customEquipment
      .flatMap((category) => category.items || [])
      .map((item) => item.name)
      .filter(Boolean)

    // Combine predefined and custom equipment names, removing duplicates
    const allEquipmentNames = [
      ...PREDEFINED_EQUIPMENT_NAMES,
      ...customEquipmentNames,
    ].filter((name, index, array) => array.indexOf(name) === index)

    return NextResponse.json({
      success: true,
      data: allEquipmentNames,
    })
  } catch (error) {
    console.error('Error fetching equipment names:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch equipment names' },
      { status: 500 },
    )
  }
}

// POST - Add new custom equipment name
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
        { success: false, message: 'Equipment name is required' },
        { status: 400 },
      )
    }

    const trimmedName = name.trim()
    if (!trimmedName) {
      return NextResponse.json(
        { success: false, message: 'Equipment name cannot be empty' },
        { status: 400 },
      )
    }

    // Check if it's already a predefined equipment name
    if (PREDEFINED_EQUIPMENT_NAMES.includes(trimmedName)) {
      return NextResponse.json({
        success: true,
        message: 'Equipment name already exists',
        data: { name: trimmedName },
      })
    }

    // Check if custom equipment name already exists in any category
    const existingEquipment = await EquipmentCategory.findOne({
      'items.name': trimmedName,
    })
    if (existingEquipment) {
      return NextResponse.json({
        success: true,
        message: 'Equipment name already exists',
        data: { name: trimmedName },
      })
    }

    // Create new equipment in a default category or add to existing "General" category
    let generalCategory = await EquipmentCategory.findOne({ name: 'General' })

    if (!generalCategory) {
      // Create a new "General" category
      generalCategory = new EquipmentCategory({
        name: 'General',
        items: [
          {
            name: trimmedName,
            brand: 'Custom',
            type: 'Equipment',
            description: `${trimmedName} equipment`,
            features: [],
          },
        ],
      })
    } else {
      // Add to existing "General" category
      generalCategory.items.push({
        name: trimmedName,
        brand: 'Custom',
        type: 'Equipment',
        description: `${trimmedName} equipment`,
        features: [],
      })
    }

    await generalCategory.save()

    return NextResponse.json({
      success: true,
      message: 'Equipment name added successfully',
      data: generalCategory,
    })
  } catch (error) {
    console.error('Error adding equipment name:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to add equipment name' },
      { status: 500 },
    )
  }
}
