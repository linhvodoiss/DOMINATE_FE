import Link from 'next/link'
import { WebHeaderStyled } from './styled'

import Image from 'next/image'
import ThemeChange from '../../../_components/theme-change'
import MenuMobile from '../../../(main)/_components/header/menu-mb'

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Subscription Package', href: '/product' },
  { label: 'Doc', href: '/doc' },
  { label: 'About', href: '/about' },
]

export default function HeaderMail() {
  return (
    <WebHeaderStyled className='bg-background-primary border-primary-system relative z-10 border-b-2'>
      <div className='header__container relative mx-auto flex max-w-[1920px] items-center justify-between py-2 pr-4 pl-0 text-xl text-[#e5e5e5] md:pr-8 md:pl-4'>
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
          <MenuMobile menuItems={menuItems} />
        </div>
        <ThemeChange className='ml-auto -translate-x-8 md:hidden' />
      </div>

      {/* Mobile Dropdown Menu */}
    </WebHeaderStyled>
  )
}
