import './admin.css'
import AntdThemeProvider from './_components/antd-theme-provider'

import SideBarAdmin from './_components/sidebar-admin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AntdThemeProvider>
      <SideBarAdmin>{children}</SideBarAdmin>
    </AntdThemeProvider>
  )
}
