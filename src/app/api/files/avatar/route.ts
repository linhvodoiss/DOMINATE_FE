import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH } from '~/constants'

import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const token = request.cookies.get(AUTH.token)?.value
  const res = await http.post(LINKS.update_avatar, {
    body: formData,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const response = NextResponse.json(res)

  return response
}
