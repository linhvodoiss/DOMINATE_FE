'use client'

import React from 'react'
import Link from 'next/link'
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'
import LockBtn from './change-pass-btn'
import LogoutBtn from './logout-btn'
import { useAuth } from './auth-context'

export default function ProfileHeader() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Link href='/login' className='header__link font-bold'>
        Đăng nhập
      </Link>
    )
  }

  return (
    <Popover>
      <PopoverTrigger>
        <div className='header__link font-bold'>{user.userName}</div>
      </PopoverTrigger>
      <PopoverContent className='border-primary-system flex flex-col rounded-2xl border-[1px] px-0 text-lg font-bold shadow-2xl'>
        <Link
          href='/profile'
          className='border-primary-system text-primary hover:bg-primary-mute mx-auto block w-full cursor-pointer py-2 text-center'
        >
          Profile
        </Link>
        <Link
          href={`/orders/purchase/${user.id}`}
          className='border-primary-system text-primary hover:bg-primary-mute mx-auto block w-full cursor-pointer py-2 text-center'
        >
          Orders
        </Link>
        <LockBtn />
        <LogoutBtn />
      </PopoverContent>
    </Popover>
  )
}
