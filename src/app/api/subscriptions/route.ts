import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH } from '~/constants'

import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const token = request.cookies.get(AUTH.token)?.value
  const res = await http.post(LINKS.subscriptions, {
    body: JSON.stringify(body),
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const response = NextResponse.json(res)

  return response
}

export async function DELETE(request: NextRequest) {
  const body = await request.json()
  const token = request.cookies.get(AUTH.token)?.value
  const res = await http.delete(LINKS.subscriptions, {
    body: JSON.stringify(body),
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const response = NextResponse.json(res)

  return response
}
