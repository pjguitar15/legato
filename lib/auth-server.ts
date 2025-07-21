import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'legato-super-secret-jwt-key-2024'

export interface AuthUser {
  username: string
  role: string
  iat: number
  exp: number
}

export async function verifyAuth(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = verify(token, JWT_SECRET) as AuthUser

    // Check if token is expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return decoded
  } catch (error) {
    console.error('Auth verification failed:', error)
    return null
  }
}

export async function verifyAuthRequest(
  request: NextRequest,
): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = verify(token, JWT_SECRET) as AuthUser

    // Check if token is expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return decoded
  } catch (error) {
    console.error('Auth verification failed:', error)
    return null
  }
}
