import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await http.post(LINKS.register_api, {
    body: JSON.stringify(body),
  })

  const response = NextResponse.json(res)

  return response
}
