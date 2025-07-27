'use client'

import React, { useEffect, useState } from 'react'
import { BellOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Dropdown, Layout, MenuProps, Space } from 'antd'
import ThemeChange from './theme-change'
import { toast } from 'sonner'
import { subscribeOnce } from '~/app/_components/socket-link'
import Link from 'next/link'

const { Header } = Layout

interface NotificationItem {
  orderId: number
  userName: string
  packageName: string
  price: number
  paymentMethod: string
  createdAt: string
}

const STORAGE_KEY = 'admin_notifications'
const MAX_NOTIFICATIONS = 5
const EXPIRATION_HOURS = 24

function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as { data: NotificationItem; timestamp: number }[]
    const now = Date.now()

    return parsed.filter(entry => now - entry.timestamp <= EXPIRATION_HOURS * 60 * 60 * 1000).map(entry => entry.data)
  } catch (err) {
    console.error('Failed to read notifications from localStorage:', err)
    return []
  }
}

function storeNotifications(notifications: NotificationItem[]) {
  try {
    const wrapped = notifications.map(n => ({
      data: n,
      timestamp: Date.now(),
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wrapped.slice(0, MAX_NOTIFICATIONS)))
  } catch (err) {
    console.error('Failed to write notifications to localStorage:', err)
  }
}

export default function AdminHeader() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  useEffect(() => {
    const existing = getStoredNotifications()
    setNotifications(existing)

    subscribeOnce('/topic/order/global', client => {
      client.subscribe('/topic/order/global', message => {
        const payload = JSON.parse(message.body)

        toast.info(`Bạn có đơn mới: ${payload.orderId}`)

        const updated = [{ ...payload }, ...existing].slice(0, MAX_NOTIFICATIONS)
        setNotifications(updated)
        storeNotifications(updated)
      })
    })
  }, [])

  const notificationItems: MenuProps['items'] =
    notifications.length > 0
      ? [
          ...notifications.map((item, index) => ({
            key: index,
            label: (
              <Link
                href={`/admin/preview/${item.orderId}`}
                target='_blank'
                className='hover:bg-muted block max-w-[300px] cursor-pointer rounded-sm px-2 py-1'
              >
                <div className='font-semibold'>{item.userName}</div>
                <div className='text-muted-foreground text-sm'>
                  {item.packageName} - {item.price.toLocaleString()}₫
                </div>
                <div className='text-xs text-gray-400'>{new Date(item.createdAt).toLocaleString()}</div>
              </Link>
            ),
          })),
          {
            type: 'divider',
          },
          {
            key: 'clear',
            label: (
              <div
                className='cursor-pointer text-center text-red-500 hover:underline'
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setNotifications([])
                  localStorage.removeItem(STORAGE_KEY)
                }}
              >
                Clear
              </div>
            ),
          },
        ]
      : [
          {
            key: 'empty',
            label: <span className='text-gray-400 italic'>Notification empty</span>,
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
