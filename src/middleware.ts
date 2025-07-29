// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import { AUTH } from '~/constants'

interface JwtPayload {
  exp: number
  iat?: number
  [key: string]: unknown
}

interface User {
  role?: string
  [key: string]: unknown
}

const PUBLIC_PATHS = ['login', 'register', 'active', 'forget', '_next', 'favicon.ico', 'static']

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH.token)?.value
  const pathname = request.nextUrl.pathname
  const userRaw = request.cookies.get(AUTH.userInfo)?.value
  let user: User | undefined = undefined

  try {
    user = userRaw ? JSON.parse(userRaw) : undefined
  } catch (err) {
    console.warn('❌ Failed to parse userInfo:', err)
  }

  const isApi = pathname.startsWith('/api')

  const isPublic =
    pathname === '/' ||
    PUBLIC_PATHS.some(path => pathname.startsWith(`/${path}`)) ||
    pathname === '/product' ||
    /^\/product\/\d+$/.test(pathname)

  if (isApi) {
    return NextResponse.next()
  }

  if (isPublic && user?.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (isPublic) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp <= now) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (err) {
    console.warn('❌ Token decode failed:', err)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user?.role === 'ADMIN' && !pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (user?.role !== 'ADMIN' && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\\.).*)'], // bắt tất cả route không phải file tĩnh
}
