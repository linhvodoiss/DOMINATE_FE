/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'

export default function MenuMobile({ menuItems }: { menuItems: any }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => {
      router.push(href)
    }, 10)
  }

  return (
    <div className='relative md:hidden'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={() => setOpen(prev => !prev)}
            className='hover:!bg-toggle absolute top-1/2 right-0 flex translate-x-10 -translate-y-1/2 cursor-pointer flex-col gap-1 rounded-md p-2 focus:outline-none'
          >
            <MenuIcon size={32} />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align='end'
          sideOffset={16}
          className='bg-background-primary z-50 mt-0 flex w-screen max-w-[60%] flex-col gap-2 rounded-md border border-white px-4 pb-4 text-white'
        >
          {menuItems.map((item: any) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={e => handleClick(e, item.href)}
              className='hover:bg-primary-mute border-b border-white/20 px-4 py-2'
            >
              {item.label}
            </Link>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  )
}
