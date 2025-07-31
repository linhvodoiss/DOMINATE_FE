import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = request.cookies.get(AUTH.token)?.value
  const licenseKey = searchParams.get('licenseKey')

  if (!licenseKey) {
    return NextResponse.json({ error: 'Missing parameter(s)' }, { status: 400 })
  }
  const res = await http.patch(LINKS.licenses_unbind, {
    params: {
      licenseKey,
    },
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const response = NextResponse.json(res)

  return response
}
