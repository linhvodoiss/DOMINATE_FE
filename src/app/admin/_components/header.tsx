'use client'

import React, { useEffect, useState } from 'react'
import { BellOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Dropdown, Layout, MenuProps, Space } from 'antd'
import ThemeChange from './theme-change'
import { toast } from 'sonner'

import { useRouter } from 'next/navigation'
import { subscribeOnce } from '~/app/_components/socket-link'

const { Header } = Layout

interface NotificationItem {
  orderId: number
  userName: string
  packageName: string
  price: number
  paymentMethod: string
  createdAt: string
}

export default function AdminHeader() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    subscribeOnce('/topic/order/global', client => {
      client.subscribe('/topic/order/global', message => {
        const payload = JSON.parse(message.body)
        console.log('[Header] New order:', payload)

        toast.info(`Bạn có đơn mới: ${payload.orderId}`)
        setNotifications(prev => [{ ...payload }, ...prev.slice(0, 4)])
      })
    })
  }, [])

  const handleClick = (orderId: number) => {
    router.push(`/admin/orders/${orderId}`)
  }

  const notificationItems: MenuProps['items'] =
    notifications.length > 0
      ? notifications.map((item, index) => ({
          key: index,
          label: (
            <div onClick={() => handleClick(item.orderId)} className='max-w-[300px] cursor-pointer'>
              <div className='font-semibold'>{item.userName}</div>
              <div className='text-muted-foreground text-sm'>
                {item.packageName} - {item.price.toLocaleString()}₫
              </div>
              <div className='text-xs text-gray-400'>{new Date(item.createdAt).toLocaleString()}</div>
            </div>
          ),
        }))
      : [
          {
            key: 'empty',
            label: <span className='text-gray-400 italic'>Không có thông báo</span>,
          },
        ]

  const userMenu: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
    },
    {
      key: 'logout',
      label: 'Logout',
    },
  ]
  console.log(notifications)

  return (
    <Header className='!bg-background flex h-16 items-center justify-end pl-3'>
      <Space size='middle'>
        <ThemeChange />

        <Dropdown menu={{ items: notificationItems }} placement='bottomRight' trigger={['click']}>
          <Badge count={notifications.length} size='small'>
            <Button type='text' icon={<BellOutlined />} />
          </Badge>
        </Dropdown>

        <Dropdown menu={{ items: userMenu }} trigger={['click']}>
          <Avatar size='default' icon={<UserOutlined />} className='cursor-pointer' />
        </Dropdown>
      </Space>
    </Header>
  )
}
