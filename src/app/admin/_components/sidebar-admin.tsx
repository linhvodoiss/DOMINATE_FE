'use client'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  ProfileOutlined,
  DropboxOutlined,
  InboxOutlined,
  SlidersOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  TagsOutlined,
  BranchesOutlined,
} from '@ant-design/icons'
import Link from 'next/link'

import Image from 'next/image'
import AdminHeader from './header'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { User } from '#/user'
const { Sider, Content } = Layout

function getMenuKey(pathname: string) {
  if (pathname.startsWith('/admin/account')) return 'account'
  if (pathname.startsWith('/admin/order')) return 'order'
  if (pathname.startsWith('/admin/package')) return 'package'
  if (pathname.startsWith('/admin/option')) return 'option'
  if (pathname.startsWith('/admin/doc')) return 'doc'
  if (pathname.startsWith('/admin/category')) return 'category'
  if (pathname.startsWith('/admin/version')) return 'version'
  if (pathname === '/admin') return 'dashboard'
  return ''
}

export default function SideBarAdmin({ children, user }: { children: ReactNode; user: User }) {
  const pathname = usePathname()
  const selectedKey = getMenuKey(pathname)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint='lg' collapsedWidth='0' className='!bg-background'>
        <div className='py-4 pl-6'>
          <Image src='/images/logo_admin.png' alt='logo' width={180} height={180} className='w-10' />
        </div>
        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[selectedKey]}
          className={`!bg-background [&_.ant-menu-item-selected]:!bg-primary-system [&_.ant-menu-submenu-selected]:!bg-primary-system [&_.ant-menu-item-selected]:!text-[#ebebeb] [&_.ant-menu-submenu-selected]:!text-[#ebebeb]`}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: <Link href='/admin'>Dashboard</Link>,
              className: '!text-secondary-gray',
            },
            {
              key: 'account',
              icon: <UserOutlined />,
              label: <Link href='/admin/account'>Account</Link>,
              className: '!text-secondary-gray',
            },
            {
              key: 'order',
              icon: <ProfileOutlined />,
              label: <Link href='/admin/order'>Payment Transaction</Link>,
              className: '!text-secondary-gray',
            },
            {
              key: 'subscription',
              icon: <DropboxOutlined />,
              label: 'Subscription',
              className: '!text-secondary-gray',
              children: [
                {
                  key: 'package',
                  icon: <InboxOutlined />,
                  label: <Link href='/admin/package'>Package</Link>,
                  className: '!text-secondary-gray',
                },
                {
                  key: 'option',
                  icon: <SlidersOutlined />,
                  label: <Link href='/admin/option'>Option</Link>,
                  className: '!text-secondary-gray',
                },
              ],
            },
            {
              key: 'resource',
              icon: <AppstoreOutlined />,
              label: 'Resource ',
              className: '!text-secondary-gray',
              children: [
                {
                  key: 'doc',
                  icon: <FileTextOutlined />,
                  label: <Link href='/admin/doc'>Doc</Link>,
                  className: '!text-secondary-gray',
                },
                {
                  key: 'category',
                  icon: <TagsOutlined />,
                  label: <Link href='/admin/category'>Category</Link>,
                  className: '!text-secondary-gray',
                },
                {
                  key: 'version',
                  icon: <BranchesOutlined />,
                  label: <Link href='/admin/version'>Version</Link>,
                  className: '!text-secondary-gray',
                },
              ],
            },
          ]}
        />
      </Sider>
      <Layout className='!bg-background'>
        <AdminHeader user={user} />

        <Content className='!bg-background !text-secondary-gray border-primary-system rounded-tl-2xl border-t-2 border-l-2'>
          <div className='min-h-[500px] rounded shadow'>{children}</div>
        </Content>
      </Layout>
    </Layout>
  )
}
