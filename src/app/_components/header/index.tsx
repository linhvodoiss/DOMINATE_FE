import Link from 'next/link'
import { WebHeaderStyled } from './styled'
import Image from 'next/image'
import ThemeChange from '../theme-change'

import ProfileHeader from '../profile-header'

// type Props = Readonly<{
//   token?: string
//   user?: User
// }>

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Product', href: '/product' },
  { label: 'Doc', href: '/doc' },
  { label: 'About', href: '/about' },
]

export default function Header() {
  return (
    <WebHeaderStyled className='bg-background-primary border-primary-system border-b-2'>
      <div className='header__container mx-auto flex w-full max-w-[1920px] items-center justify-between pr-8 text-xl text-[#e5e5e5]'>
        <div className='flex items-center justify-start gap-2'>
          <Image
            src='/images/logo_transparent.png'
            alt='logo'
            width={1024}
            height={700}
            className='aspect-[1024/700] w-24'
          />
          <ul className='flex items-center justify-center font-bold'>
            {menuItems.map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className='relative cursor-pointer px-8 py-6 font-bold text-white no-underline after:absolute after:bottom-3 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-white after:transition-all after:duration-300 hover:after:w-2/3'
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <ThemeChange />
            </li>
          </ul>
        </div>
        <ProfileHeader />
      </div>
    </WebHeaderStyled>
  )
}
