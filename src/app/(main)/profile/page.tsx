import React from 'react'
import ProfilePage from './_components/ProfilePage'
import { cookies } from 'next/headers'
import { AUTH } from '~/constants'
import { User } from '#/user'

export default async function page() {
  const cookieStore = await cookies()
  const user = (
    cookieStore.get(AUTH.userInfo)?.value ? JSON.parse(cookieStore.get(AUTH.userInfo)!.value) : undefined
  ) as User | undefined
  return <ProfilePage user={user as User} />
}
