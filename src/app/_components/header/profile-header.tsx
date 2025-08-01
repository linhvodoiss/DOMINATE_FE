'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'

import { useAuth } from '../auth-context'
import LockBtn from './change-pass-btn'
import LogoutBtn from './logout-btn'
import Image from 'next/image'
import http from '~/utils/http'
import { User } from '#/user'
import { LINKS } from '~/constants/links'
import { env } from '~/configs/env'

export default function ProfileHeader() {
  const { user } = useAuth()
  // Fetch profile data from API
  const [avatar, setAvatar] = useState<string>('')
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await http.get<User>(LINKS.profile, {
          baseUrl: '/api',
        })
        if (res) {
          setAvatar(res.data?.avatarUrl ?? '')
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {}
    }

    fetchProfile()
  }, [user])
  if (!user) {
    return (
      <Link href='/login' className='font-bold'>
        Login
      </Link>
    )
  }
  const avatarSrc = avatar
    ? `${env.SOCKET_URL}${avatar}`
    : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg'

  return (
    <Popover>
      <PopoverTrigger>
        <div className='flex cursor-pointer items-center gap-2'>
          <div className='font-bold'>{user.userName}</div>
          <div className='h-6 w-6 rounded-full'>
            <Image
              src={avatarSrc}
              alt='avatar'
              width={150}
              height={150}
              className='size-full rounded-full object-cover ring-1 ring-white'
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className='bg-background-primary mt-6 flex flex-col rounded-2xl border-1 border-solid border-white px-4 text-white shadow-md'>
        <Link
          href='/profile'
          className='hover:bg-primary-mute block w-full cursor-pointer border-y border-white/20 px-4 pt-4 pb-2'
        >
          Profile
        </Link>
        <Link
          href={`/licenses/${user.id}`}
          className='hover:bg-primary-mute mx-auto block w-full cursor-pointer border-b border-white/20 px-4 pt-4 pb-2'
        >
          My Licenses
        </Link>
        <Link
          href={`/my-order/${user.id}`}
          className='hover:bg-primary-mute mx-auto block w-full cursor-pointer border-b border-white/20 px-4 pt-4 pb-2'
        >
          My Orders
        </Link>
        <LockBtn />
        <LogoutBtn />
      </PopoverContent>
    </Popover>
  )
}
