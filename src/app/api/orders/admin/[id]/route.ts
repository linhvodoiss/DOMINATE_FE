import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get(AUTH.token)?.value
  const { id } = await params
  const res = await http.get(`${LINKS.order}/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  const response = NextResponse.json(res)

  return response
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get(AUTH.token)?.value
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const newStatus = searchParams.get('newStatus')

  if (!newStatus) {
    return NextResponse.json({ error: 'Missing parameter' }, { status: 400 })
  }

  const res = await http.patch(`${LINKS.order_admin}/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    params: { newStatus },
  })

  return NextResponse.json(res)
}
