'use client'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  IdcardOutlined,
  EllipsisOutlined,
} from '@ant-design/icons'
import Link from 'next/link'

import Image from 'next/image'
import AdminHeader from './header'
import { ReactNode } from 'react'
const { Sider, Content } = Layout
export default function SideBarAdmin({ children }: { children: ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint='lg' collapsedWidth='0' className='!bg-background'>
        <div className='py-4 pl-6'>
          <Image src='/images/logo_admin.png' alt='logo' width={180} height={180} className='w-10' />
        </div>
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['dashboard']}
          className='!bg-background [&_.ant-menu-item-selected]:!bg-primary-system [&_.ant-menu-item-selected]:!text-[#ebebeb]'
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: <Link href='/admin/dashboard'>Dashboard</Link>,
              className: '!text-secondary-gray',
            },
            {
              key: 'user',
              icon: <UserOutlined />,
              label: <Link href='/admin/user'>User</Link>,
              className: '!text-secondary-gray',
            },
            {
              key: 'license',
              icon: <IdcardOutlined />,
              label: <Link href='/admin/license'>License</Link>,
              className: '!text-secondary-gray',
            },
            {
              key: 'package',
              icon: <AppstoreAddOutlined />,
              label: <Link href='/admin/package'>Package</Link>,
              className: '!text-secondary-gray',
            },
            {
              key: 'option',
              icon: <EllipsisOutlined />,
              label: <Link href='/admin/option'>Option</Link>,
              className: '!text-secondary-gray',
            },
          ]}
        />
      </Sider>
      <Layout className='!bg-background'>
        <AdminHeader />

        <Content className='!bg-background !text-secondary-gray border-primary-system rounded-tl-2xl border-t-2 border-l-2'>
          <div className='min-h-[500px] rounded p-6 shadow'>{children}</div>
        </Content>
      </Layout>
    </Layout>
  )
}
