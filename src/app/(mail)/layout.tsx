import { Suspense } from 'react'
import HeaderMail from './_components/headerMail'
import { LoadingFallback } from '../_components/page-content'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HeaderMail />
      <div className='mx-auto max-w-[1536px]'>{children}</div>
    </Suspense>
  )
}
