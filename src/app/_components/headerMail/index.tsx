import Link from 'next/link'
import { WebHeaderStyled } from './styled'

import Image from 'next/image'
import ThemeChange from '../theme-change'

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Product', href: '/product' },
  { label: 'Doc', href: '/doc' },
  { label: 'About', href: '/about' },
]

export default function HeaderMail() {
  return (
    <WebHeaderStyled className='bg-background-primary border-primary-system border-b-2'>
      <div className='header__container mx-auto flex w-full max-w-[1920px] items-center justify-between pr-8 text-xl text-white'>
        <div className='flex items-center justify-start gap-8'>
          <Image src='/images/logo.png' alt='logo' width={1024} height={1024} className='w-24 object-contain' />
          <ul className='flex items-center justify-center'>
            {menuItems.map(item => (
              <li key={item.label}>
                <Link href={item.href} className='header__link'>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <ThemeChange />
            </li>
          </ul>
        </div>
      </div>
    </WebHeaderStyled>
  )
}
