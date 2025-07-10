import { removeCookieHeaderString } from '~/utils/helper'

export async function POST() {
  return Response.json(
    {},
    {
      headers: {
        'Set-Cookie': removeCookieHeaderString,
      },
    }
  )
}
