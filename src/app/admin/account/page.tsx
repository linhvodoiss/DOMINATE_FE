import { LINKS } from '~/constants/links'
import http from '~/utils/http'

import { User } from '#/user'
import AccountPage from './_components/account-page'
import { cookies } from 'next/headers'
import { AUTH } from '~/constants'
interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    page?: string
    search?: string
    status?: boolean
    isActive?: string
    sort?: string
  }>
}

export default async function ProductPage({ searchParams }: Props) {
  const cookieStore = await cookies()
  const { page, search, status, isActive, sort } = await searchParams
  const user = (
    cookieStore.get(AUTH.userInfo)?.value ? JSON.parse(cookieStore.get(AUTH.userInfo)!.value) : undefined
  ) as User | undefined
  const {
    content = [],
    pageNumber,
    pageSize,
    totalElements,
  } = await http.get<User>(LINKS.account, {
    params: { page, search, status, isActive, sort },
  })
  const listUser = content as User[]

  return (
    <AccountPage
      user={user as User}
      listUser={listUser}
      pageNumber={pageNumber as number}
      pageSize={pageSize as number}
      totalElements={totalElements as number}
    />
  )
}
