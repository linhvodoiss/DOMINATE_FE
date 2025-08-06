import React from 'react'
import { cookies } from 'next/headers'
import { AUTH } from '~/constants'
import { User } from '#/user'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import { OrderResponse } from '#/order'

import { PAGE_SIZE } from '~/constants/paginate'
import MyOrderPage from './_components/my-order-page'

export default async function page() {
  const cookieStore = await cookies()
  const user = (
    cookieStore.get(AUTH.userInfo)?.value ? JSON.parse(cookieStore.get(AUTH.userInfo)!.value) : undefined
  ) as User | undefined
  const token = cookieStore.get(AUTH.token)?.value
  const { content = [] } = await http.get<OrderResponse>(`${LINKS.order_user}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    params: { page: 1, size: PAGE_SIZE },
  })
  const listOrder = content

  return <MyOrderPage user={user as User} data={listOrder as OrderResponse[]} />
}
