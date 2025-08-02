import './admin.css'
import AntdThemeProvider from './_components/antd-theme-provider'

import SideBarAdmin from './_components/sidebar-admin'
import { AuthProvider } from '../_components/auth-context'
import { cookies } from 'next/headers'
import { AUTH } from '~/constants'
import { User } from '#/user'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH.token)?.value
  const user = (
    cookieStore.get(AUTH.userInfo)?.value ? JSON.parse(cookieStore.get(AUTH.userInfo)!.value) : undefined
  ) as User | undefined

  return (
    <AntdThemeProvider>
      <AuthProvider token={token} user={user}>
        <SideBarAdmin user={user as User}>{children}</SideBarAdmin>
      </AuthProvider>
    </AntdThemeProvider>
  )
}
