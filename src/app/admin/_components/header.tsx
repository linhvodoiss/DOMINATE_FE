'use client'

import { Layout, Menu, Avatar, Dropdown, Space } from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import React from 'react'

const { Header } = Layout

const items = [
  { key: '1', label: 'Trang chủ' },
  { key: '2', label: 'Sản phẩm' },
  { key: '3', label: 'Liên hệ' },
]

const userMenu = [
  {
    key: 'profile',
    icon: <SettingOutlined />,
    label: 'Tài khoản',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: 'Đăng xuất',
  },
]

export default function AppHeader() {
  const onMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // TODO: Xử lý đăng xuất
      console.log('Đăng xuất')
    }
  }

  return (
    <Header className='flex items-center justify-between bg-white px-6 shadow-md'>
      <div className='text-xl font-bold text-blue-600'>MyApp</div>

      <Menu mode='horizontal' items={items} className='flex-1 justify-center border-b-0' />

      <Dropdown menu={{ items: userMenu, onClick: onMenuClick }}>
        <Space className='cursor-pointer'>
          <Avatar icon={<UserOutlined />} />
        </Space>
      </Dropdown>
    </Header>
  )
}
