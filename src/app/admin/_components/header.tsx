'use client'

import React from 'react'
import { BellOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Dropdown, Layout, Space } from 'antd'
import ThemeChange from './theme-change'

const { Header } = Layout

export default function AdminHeader() {
  const items = [
    {
      key: 'profile',
      label: 'Profile',
    },
    {
      key: 'logout',
      label: 'Logout',
    },
  ]

  return (
    <Header className='!bg-background flex h-16 items-center justify-end pl-3'>
      <Space size='middle'>
        <ThemeChange />

        <Badge count={5} size='small'>
          <Button type='text' icon={<BellOutlined />} />
        </Badge>

        <Dropdown menu={{ items }} trigger={['click']}>
          <Avatar size='default' icon={<UserOutlined />} className='cursor-pointer' />
        </Dropdown>
      </Space>
    </Header>
  )
}
