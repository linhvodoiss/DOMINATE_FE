import { cookies } from 'next/headers'
import { AUTH } from '~/constants'
import { User } from '#/user'
import { AuthProvider } from '../_components/auth-context'
import Header from '../_components/header'
import Footer from '../_components/footer'
import { Suspense } from 'react'
import { LoadingFallback } from '../_components/page-content'

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH.token)?.value
  const user = (
    cookieStore.get(AUTH.userInfo)?.value ? JSON.parse(cookieStore.get(AUTH.userInfo)!.value) : undefined
  ) as User | undefined

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthProvider token={token} user={user}>
        <Header />
        <div className='mx-auto min-h-[100vh] w-full max-w-[1440px] px-8 pb-24'>{children}</div>
        <Footer />
      </AuthProvider>
    </Suspense>
  )
}
