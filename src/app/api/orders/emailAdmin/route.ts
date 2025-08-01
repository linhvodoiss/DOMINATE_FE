import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = request.cookies.get(AUTH.token)?.value
  const email = searchParams.get('email')
  const orderId = searchParams.get('orderId')
  const packageId = searchParams.get('packageId')

  if (!email || !orderId || !packageId) {
    return NextResponse.json({ error: 'Missing parameter(s)' }, { status: 400 })
  }
  const res = await http.post(LINKS.order_email_admin, {
    params: {
      email,
      orderId,
      packageId,
    },
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const response = NextResponse.json(res)

  return response
}
