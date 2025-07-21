import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sign } from 'jsonwebtoken'

// Environment variables for secure authentication
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'legato2024!'
const JWT_SECRET = process.env.JWT_SECRET || 'legato-super-secret-jwt-key-2024'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 },
      )
    }

    // Secure authentication with environment variables
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create a secure session token
      const token = sign(
        {
          username: ADMIN_USERNAME,
          role: 'admin',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
        },
        JWT_SECRET,
      )

      // Set secure HTTP-only cookie
      const cookieStore = await cookies()
      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
      })

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: { username: ADMIN_USERNAME, role: 'admin' },
      })
    } else {
      // Log failed login attempts (for security monitoring)
      const clientIP =
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown'
      console.warn(
        `Failed login attempt for username: ${username} from IP: ${clientIP}`,
      )

      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication service unavailable' },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Legato Admin Authentication API',
    version: '2.0.0',
    secure: true,
  })
}
