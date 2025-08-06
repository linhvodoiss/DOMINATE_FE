import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = request.cookies.get(AUTH.token)?.value
  const page = searchParams.get('page')
  const size = searchParams.get('size')
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  if (!page || !size) {
    return NextResponse.json({ error: 'Missing parameter(s)' }, { status: 400 })
  }

  const res = await http.get(`${LINKS.order_user}`, {
    params: {
      page,
      size,
      status,
      search,
    },
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const response = NextResponse.json(res)

  return response
}
