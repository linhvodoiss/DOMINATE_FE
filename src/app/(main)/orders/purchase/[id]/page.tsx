import React from 'react'
import { cookies } from 'next/headers'
import { AUTH } from '~/constants'
import { User } from '#/user'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import { OrderResponse } from '#/order'
import PurchasePage from './_components'
import { PAGE_SIZE } from '~/constants/paginate'

interface Props {
  params: { id: string }
  user: User
}

export default async function page({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const user = (
    cookieStore.get(AUTH.userInfo)?.value ? JSON.parse(cookieStore.get(AUTH.userInfo)!.value) : undefined
  ) as User | undefined
  const token = cookieStore.get(AUTH.token)?.value
  const { content = [] } = await http.get<OrderResponse>(`${LINKS.order_user}/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    params: { page: 1, size: PAGE_SIZE },
  })
  const listOrder = content

  return <PurchasePage user={user as User} data={listOrder as OrderResponse[]} id={id} />
}
