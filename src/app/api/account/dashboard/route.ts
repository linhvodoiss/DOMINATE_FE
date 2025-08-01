import { NextRequest, NextResponse } from 'next/server'
import { AUTH } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH.token)?.value
  const res = await http.get(`${LINKS.account_dashboard}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const response = NextResponse.json(res)

  return response
}
