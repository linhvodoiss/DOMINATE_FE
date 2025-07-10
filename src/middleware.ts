// middleware.ts

import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import { AUTH } from '~/constants'

// Định nghĩa kiểu cho JWT (tùy theo backend trả về)
interface JwtPayload {
  exp: number
  iat?: number
  [key: string]: unknown
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH.token)?.value

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const now = Math.floor(Date.now() / 1000)
      const timeRemaining = decoded.exp - now

      console.log('///////////////////////////////////////////////')
      console.log('Thời gian hiện tại:', now)
      console.log('Token hết hạn lúc:', decoded.exp)
      console.log('Thời gian còn lại:', timeRemaining, 'giây')
      console.log('///////////////////////////////////////////////')

      if (timeRemaining <= 0) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } else {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!login|register|api|_next|favicon.ico).*)'],
}
