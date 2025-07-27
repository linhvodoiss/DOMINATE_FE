import React from 'react'
import { cookies } from 'next/headers'
import { AUTH } from '~/constants'
import { User } from '#/user'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import { OrderResponse } from '#/order'

import { PAGE_SIZE } from '~/constants/paginate'
import PreviewPage from './_components/preview-page'

interface Props {
  params: { id: string }
  user: User
}

export default async function page({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  // const user = (
  //   cookieStore.get(AUTH.userInfo)?.value ? JSON.parse(cookieStore.get(AUTH.userInfo)!.value) : undefined
  // ) as User | undefined
  const token = cookieStore.get(AUTH.token)?.value
  const { data } = await http.get<OrderResponse>(`${LINKS.order}/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    params: { page: 1, size: PAGE_SIZE },
  })
  const detailOrder = data

  return <PreviewPage data={detailOrder as OrderResponse} id={id} />
}
