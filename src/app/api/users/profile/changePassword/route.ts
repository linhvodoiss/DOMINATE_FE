import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get(AUTH.token)?.value
  const body = await request.json()

  const res = await http.patch(LINKS.change_password, {
    body: JSON.stringify(body),
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const response = NextResponse.json(res)

  return response
}
