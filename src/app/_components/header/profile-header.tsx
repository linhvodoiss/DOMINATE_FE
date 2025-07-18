'use client'

import React from 'react'
import Link from 'next/link'
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'

import { useAuth } from '../auth-context'
import LockBtn from './change-pass-btn'
import LogoutBtn from './logout-btn'

export default function ProfileHeader() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Link href='/login' className='font-bold'>
        Login
      </Link>
    )
  }

  return (
    <Popover>
      <PopoverTrigger>
        <div className='cursor-pointer font-bold'>{user.userName}</div>
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
