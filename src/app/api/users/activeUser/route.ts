import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing parameter' }, { status: 400 })
  }

  const res = await http.get(LINKS.active_register, {
    params: { token },
  })

  return NextResponse.json(res)
}
