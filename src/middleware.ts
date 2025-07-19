// middleware.ts

import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import { AUTH } from '~/constants'

interface JwtPayload {
  exp: number
  iat?: number
  [key: string]: unknown
}

// Route public
const PUBLIC_PATHS = ['login', 'register', 'active', 'forget', 'api', '_next', 'favicon.ico', 'static']

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH.token)?.value
  const pathname = request.nextUrl.pathname

  console.log('🔍 PATHNAME:', pathname)

  // No test with public route
  const isPublic =
    pathname === '/' ||
    PUBLIC_PATHS.some(path => pathname.startsWith(`/${path}`)) ||
    pathname === '/product' ||
    /^\/product\/\d+$/.test(pathname)

  if (isPublic) {
    return NextResponse.next()
  }

  // Check valid token
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const now = Math.floor(Date.now() / 1000)
      const timeRemaining = decoded.exp - now

      console.log('📅 Now:', now)
      console.log('🕒 Exp:', decoded.exp)
      console.log('⏳ Time remaining:', timeRemaining)

      if (timeRemaining <= 0) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (err) {
      console.warn('❌ Token decode failed:', err)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } else {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\\.).*)'],
}
