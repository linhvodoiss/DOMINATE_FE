import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const phoneNumber = searchParams.get('phoneNumber')

  if (!phoneNumber) {
    return NextResponse.json({ error: 'Missing parameter' }, { status: 400 })
  }

  const res = await http.get(LINKS.check_phone_number__exist, {
    params: { phoneNumber },
  })

  return NextResponse.json(res)
}
