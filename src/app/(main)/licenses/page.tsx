import React from 'react'
import { cookies } from 'next/headers'
import { AUTH } from '~/constants'
import { User } from '#/user'

import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import { LicenseResponse } from '#/licenses'
import { PAGE_SIZE } from '~/constants/paginate'
import LicensePage from './_components'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string; type?: string; search?: string }>
  user: User
}

export default async function page({ searchParams }: Props) {
  const { page, type, search } = await searchParams

  const cookieStore = await cookies()
  const user = (
    cookieStore.get(AUTH.userInfo)?.value ? JSON.parse(cookieStore.get(AUTH.userInfo)!.value) : undefined
  ) as User | undefined
  const token = cookieStore.get(AUTH.token)?.value
  const {
    content = [],
    pageNumber,
    totalPages,
  } = await http.get<LicenseResponse>(`${LINKS.licenses_user}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    params: { page, size: PAGE_SIZE, type, search },
  })
  const listLicenses = content
  const { data = [] } = await http.get<LicenseResponse>(`${LINKS.licenses_can_used}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
  const listLicensesUsed = data

  return (
    <LicensePage
      data={listLicenses as LicenseResponse[]}
      dataLicenseUsed={listLicensesUsed as LicenseResponse[]}
      user={user as User}
      totalPages={totalPages as number}
      pageNumber={pageNumber as number}
    />
  )
}
