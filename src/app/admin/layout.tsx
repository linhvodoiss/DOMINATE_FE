import { Suspense } from 'react'
import { LoadingFallback } from '../_components/page-content'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <header>Đây là header</header>
      <div className='mx-auto max-w-[1536px]'>{children}</div>
    </Suspense>
  )
}
