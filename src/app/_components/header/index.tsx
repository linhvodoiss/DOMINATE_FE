'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { WebHeaderStyled } from './styled'
import ThemeChange from '../theme-change'
import ProfileHeader from '../profile-header'
import { MenuIcon } from 'lucide-react'

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Product', href: '/product' },
  { label: 'Doc', href: '/doc' },
  { label: 'About', href: '/about' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  return (
    <WebHeaderStyled className='bg-background-primary border-primary-system relative z-10 border-b-2'>
      <div className='header__container relative mx-auto flex max-w-[1920px] items-center justify-between px-4 py-2 pl-0 text-xl text-[#e5e5e5] md:pl-4'>
        {/* Left side: logo + menu */}
        <div className='relative flex items-center gap-4'>
          <Image
            src='/images/logo_transparent.png'
            alt='logo'
            width={1024}
            height={700}
            className='aspect-[1024/700] w-24'
          />

          {/* Desktop Menu */}
          <ul className='hidden items-center gap-4 font-bold md:flex'>
            {menuItems.map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className='relative cursor-pointer px-4 py-2 text-white no-underline after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-white after:transition-all after:duration-300 hover:after:w-2/3'
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <ThemeChange />
            </li>
          </ul>
          <button
            className='hover:!bg-toggle absolute top-1/2 right-0 flex translate-x-10 -translate-y-1/2 cursor-pointer flex-col gap-1 rounded-md p-2 focus:outline-none md:hidden'
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <MenuIcon size={32} />
          </button>
        </div>
        <ThemeChange className='ml-auto -translate-x-8 md:hidden' />
        <ProfileHeader />
        {menuOpen && (
          <div
            ref={menuRef}
            className='bg-background-primary absolute top-20 right-0 left-0 flex flex-col gap-2 rounded-md border-1 border-solid border-white px-4 pb-4 md:hidden'
          >
            {menuItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className='border-b border-white/20 py-2'
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
    </WebHeaderStyled>
  )
}
