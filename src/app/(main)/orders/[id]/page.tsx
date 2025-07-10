import React from 'react'
import { cookies } from 'next/headers'
import { AUTH } from '~/constants'
import { User } from '#/user'
import OrderPage from './_components'
import { PackageResponse } from '#/package'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'

interface Props {
  params: { id: string }
  user: User
}

export default async function page({ params }: Props) {
  const { id } = await params
  const { data } = await http.get<PackageResponse>(`${LINKS.detailPackage}/${id}`)
  const cookieStore = await cookies()
  const user = (
    cookieStore.get(AUTH.userInfo)?.value ? JSON.parse(cookieStore.get(AUTH.userInfo)!.value) : undefined
  ) as User | undefined
  return <OrderPage user={user as User} data={data as PackageResponse} />
}
