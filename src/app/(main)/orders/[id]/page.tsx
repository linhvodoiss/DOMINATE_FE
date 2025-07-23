import React from 'react'
import { cookies } from 'next/headers'
import { AUTH, CODE_SUCCESS } from '~/constants'
import { User } from '#/user'
import OrderPage from './_components'
import { PackageResponse } from '#/package'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import { redirect } from 'next/navigation'
interface Props {
  params: { id: string }
  user: User
}

export default async function page({ params }: Props) {
  const { id } = await params
  try {
    const { data, code } = await http.get<PackageResponse>(`${LINKS.detailPackage}/${id}`)
    if (!CODE_SUCCESS.includes(code)) {
      redirect('/')
    }
    const cookieStore = await cookies()
    const user = (
      cookieStore.get(AUTH.userInfo)?.value ? JSON.parse(cookieStore.get(AUTH.userInfo)!.value) : undefined
    ) as User | undefined
    return <OrderPage user={user as User} data={data as PackageResponse} id={id} />
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    redirect('/')
  }
}
