import React from 'react'
import { cookies } from 'next/headers'
import { AUTH } from '~/constants'
import { User } from '#/user'

import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import { LicenseResponse } from '#/licenses'
import { PAGE_COMMON_SIZE } from '~/constants/paginate'
import LicensePage from './_components/license-page'

interface Props {
  params: { id: string }
  searchParams: { page?: string }
  user: User
}

export default async function page({ params, searchParams }: Props) {
  const { id } = params
  const page = Number(searchParams.page || 1)
  const cookieStore = await cookies()
  const user = (
    cookieStore.get(AUTH.userInfo)?.value ? JSON.parse(cookieStore.get(AUTH.userInfo)!.value) : undefined
  ) as User | undefined
  const token = cookieStore.get(AUTH.token)?.value
  const {
    content = [],
    pageNumber,
    totalPages,
  } = await http.get<LicenseResponse>(`${LINKS.licenses_user}/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    params: { page, size: 2 },
  })
  const listLicenses = content
  return (
    <LicensePage
      data={listLicenses as LicenseResponse[]}
      id={id}
      user={user as User}
      totalPages={totalPages as number}
      pageNumber={pageNumber as number}
    />
  )
}
