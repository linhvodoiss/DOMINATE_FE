'use client'

import { CircleCheck } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'

const time = 5

export default function ActiveRegister() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(time)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) return

    const activate = async () => {
      try {
        await http.get(LINKS.active_register, {
          params: { token },
          baseUrl: '/api',
        })
      } catch (error) {
        console.error('Kích hoạt thất bại:', error)
        toast.error('Kích hoạt thất bại')
      }
    }

    activate()
  }, [token])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    const redirectTimer = setTimeout(() => {
      router.push('/')
      router.refresh()
    }, time * 1000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <p className='mt-8 flex items-center justify-center gap-4 text-center text-4xl font-semibold'>
      Bạn đã kích hoạt tài khoản thành công, trở lại trang chủ sau {countdown} s{' '}
      <CircleCheck className='h-8 w-8 text-green-600' />
    </p>
  )
}
