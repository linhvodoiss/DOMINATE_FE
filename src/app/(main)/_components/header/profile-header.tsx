/* eslint-disable @next/next/no-img-element */
'use client'
import Link from 'next/link'
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'

import { useAuth } from '../../../_components/auth-context'
import LockBtn from './change-pass-btn'
import LogoutBtn from './logout-btn'

import { User } from '#/user'

import { env } from '~/configs/env'

export default function ProfileHeader({ data }: { data?: User }) {
  const { user } = useAuth()

  if (!user || !data) {
    return (
      <Link href='/login' className='font-bold'>
        Login
      </Link>
    )
  }
  const avatarSrc = data?.avatarUrl
    ? `${env.SOCKET_URL}${data.avatarUrl}`
    : 'https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg'

  return (
    <Popover>
      <PopoverTrigger>
        <div className='flex cursor-pointer items-center gap-2'>
          <div className='font-bold'>{user.userName}</div>
          <div className='h-6 w-6 rounded-full'>
            <img
              src={avatarSrc}
              alt='avatar'
              width={150}
              height={150}
              loading='lazy'
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
          href={`/licenses`}
          className='hover:bg-primary-mute mx-auto block w-full cursor-pointer border-b border-white/20 px-4 pt-4 pb-2'
        >
          My Licenses
        </Link>
        <Link
          href={`/my-order`}
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
