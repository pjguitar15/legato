import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Vlog from '@/models/Vlog'

export async function GET() {
  try {
    await connectToDatabase()
    const vlogs = await Vlog.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: vlogs })
  } catch (e) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch' },
      { status: 500 },
    )
  }
}
