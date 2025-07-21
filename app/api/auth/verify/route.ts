import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthRequest } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuthRequest(request)

    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          username: user.username,
          role: user.role,
        },
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication verification failed' },
      { status: 500 },
    )
  }
}
