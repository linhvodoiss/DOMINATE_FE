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
        console.error('Active failed:', error)
        toast.error('Active failed')
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
      Your account active successfully, redirecting home page {countdown} s{' '}
      <CircleCheck className='h-8 w-8 text-green-600' />
    </p>
  )
}
