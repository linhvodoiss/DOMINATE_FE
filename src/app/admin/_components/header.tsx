'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { BellOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Dropdown, Layout, MenuProps, Space } from 'antd'
import ThemeChange from './theme-change'
import { toast } from 'sonner'
import { disconnectSocket, subscribeOnce } from '~/app/_components/socket-link'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { User } from '#/user'

const { Header } = Layout

interface NotificationItem {
  orderId: number
  userName: string
  packageName: string
  price: number
  paymentMethod: string
  createdAt: string
  content: string
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

export default function AdminHeader({ user }: { user: User }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const router = useRouter()
  const [, startTransition] = useTransition()

  useEffect(() => {
    const existing = getStoredNotifications()
    setNotifications(existing)

    subscribeOnce('/topic/order/global', client => {
      client.subscribe('/topic/order/global', message => {
        const payload = JSON.parse(message.body)

        toast.info(`You have an new order: ${payload.orderId}`)

        setNotifications(prev => {
          const updated = [{ ...payload }, ...prev].slice(0, MAX_NOTIFICATIONS)
          storeNotifications(updated)
          return updated
        })
      })
      client.subscribe('/topic/order/report', message => {
        const payload = JSON.parse(message.body)

        toast.warning(`Order #${payload.orderId} has been reported`)

        setNotifications(prev => {
          const updated = [{ ...payload }, ...prev].slice(0, MAX_NOTIFICATIONS)
          storeNotifications(updated)
          return updated
        })
      })
    })
  }, [])

  async function logoutHandler() {
    startTransition(async () => {
      await http.post(LINKS.logout_api, { baseUrl: '/api/auth' })
      router.push('/')
      disconnectSocket()
      router.refresh()
    })
  }
  // const hi = () => {
  //   toast.success('ca cho')
  // }
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
                <div className='font-semibold'>
                  #{item.orderId} {item.userName ? `- ${item.userName}` : ''}
                </div>

                {item.content ? (
                  <div className='text-sm text-red-500'>{item.content}</div>
                ) : (
                  <>
                    <div className='text-muted-foreground text-sm'>
                      {item.packageName} - {item.price?.toLocaleString()}₫
                    </div>
                    <div className='text-xs text-gray-400'>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                    </div>
                  </>
                )}
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
                  router.refresh()
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
      onClick: () => router.push('/admin/profile'),
    },
    {
      key: 'logout',
      label: 'Logout',
      onClick: () => logoutHandler(),
    },
  ]

  return (
    <Header className='!bg-background flex h-16 items-center justify-end !px-4'>
      <Space size='middle'>
        <ThemeChange />

        <Dropdown menu={{ items: notificationItems }} placement='bottomRight' trigger={['click']}>
          <Badge count={notifications.length} size='small'>
            <Button type='text' icon={<BellOutlined />} />
          </Badge>
        </Dropdown>
        <Dropdown menu={{ items: userMenu }} trigger={['click']}>
          <Badge>
            <span className='cursor-pointer pr-2'>{user?.userName}</span>
            <Avatar size='small' icon={<UserOutlined />} className='cursor-pointer' />
          </Badge>
        </Dropdown>
      </Space>
    </Header>
  )
}
