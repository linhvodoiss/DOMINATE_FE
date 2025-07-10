import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const newPassword = searchParams.get('newPassword')

  if (!token || !newPassword) {
    return NextResponse.json({ error: 'Missing parameter(s)' }, { status: 400 })
  }

  const res = await http.get(LINKS.reset_password, {
    params: {
      token,
      newPassword,
    },
  })

  return NextResponse.json(res)
}
