import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Missing parameter' }, { status: 400 })
  }

  const res = await http.get(LINKS.forget_pass, {
    params: { email },
  })

  return NextResponse.json(res)
}
