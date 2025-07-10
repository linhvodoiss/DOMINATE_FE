import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH, CODE_SUCCESS } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import { env } from '~/configs/env'
import { LoginResponse } from '#/user'
import { jwtDecode } from 'jwt-decode'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await http.post<LoginResponse>(LINKS.login_api, {
    body: JSON.stringify(body),
  })

  const response = NextResponse.json(res)

  if (CODE_SUCCESS.includes(res.code)) {
    const token = res.user?.token || ''
    let expiresDate: Date | undefined

    try {
      const decoded = jwtDecode<{ exp: number }>(token)
      expiresDate = new Date(decoded.exp * 1000) // Convert to ms
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error('Lỗi decode token, fallback sang TOKEN_EXPIRED')
      expiresDate = new Date(Date.now() + Number(env.TOKEN_EXPIRED))
    }

    response.cookies.set(AUTH.token, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: expiresDate,
      path: '/',
    })

    response.cookies.set(AUTH.userInfo, JSON.stringify(res.user), {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      expires: expiresDate,
      path: '/',
    })
  }

  return response
}
