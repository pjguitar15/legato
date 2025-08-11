import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Vlog from '@/models/Vlog'
import { verifyAuthRequest } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuthRequest(request)
    if (!auth)
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    await connectToDatabase()
    const body = await request.json()
    if (!body?.url || !body?.youtubeId) {
      return NextResponse.json(
        { success: false, message: 'url and youtubeId are required' },
        { status: 400 },
      )
    }
    const vlog = await Vlog.create({
      url: body.url,
      youtubeId: body.youtubeId,
      title: body.title || '',
    })
    return NextResponse.json({ success: true, data: vlog })
  } catch (e) {
    return NextResponse.json(
      { success: false, message: 'Failed to add vlog' },
      { status: 500 },
    )
  }
}
