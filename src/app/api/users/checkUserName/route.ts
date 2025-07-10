import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userName = searchParams.get('userName')

  if (!userName) {
    return NextResponse.json({ error: 'Missing parameter' }, { status: 400 })
  }

  const res = await http.get(LINKS.check_username_exist, {
    params: { userName },
  })

  return NextResponse.json(res)
}
