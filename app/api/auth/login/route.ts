import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Simple authentication - replace with proper auth later
    if (username === 'admin' && password === 'admin') {
      const token = 'admin-authenticated' // Simple token for localStorage

      return NextResponse.json({
        success: true,
        token,
        message: 'Login successful',
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Login endpoint - use POST method' })
}
