'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CircleCheck } from 'lucide-react'
import React from 'react'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { OrderResponse } from '#/order'

import { toast } from 'sonner'
import { CODE_SUCCESS } from '~/constants'
import Link from 'next/link'
import { OrderStatusEnum } from '#/tabs-order'

// export default function SuccessPage() {
//   const searchParams = useSearchParams()
//   const [isLoading, setIsLoading] = useState(true)
//   const [errorMessage, setErrorMessage] = useState('')
//   const [licenseKey, setLicenseKey] = useState<string>('')
//   const hasRun = useRef(false)

//   useEffect(() => {
//     if (hasRun.current) return
//     hasRun.current = true

//     const orderId = searchParams.get('orderCode')

//     const newStatus = OrderStatusEnum.SUCCESS

//     if (!orderId) return

//     const createLicense = async () => {
//       try {
//         // 1. UPDATE STATUS ORDER
//         const resOrder = await http.patch<OrderResponse>(`${LINKS.order_silent}/${orderId}`, {
//           params: { newStatus },
//           baseUrl: '/api',
//         })

//         if (!CODE_SUCCESS.includes(resOrder.code)) {
//           setErrorMessage(resOrder.message || 'Update order failed')
//           return
//         }

//         // 2. CALL API MAKE LICENSE
//         const resLis = await http.post<LicenseResponse>(LINKS.licenses_create, {
//           body: JSON.stringify({ orderId: Number(orderId) }),
//           baseUrl: '/api',
//         })

//         if (!CODE_SUCCESS.includes(resLis.code)) {
//           setErrorMessage(resLis.message || 'Create license failed')
//           return
//         }
//         setLicenseKey(resLis?.data?.licenseKey as string)
//         toast.success(resLis.message || 'License created successfully.')
//       } catch (err) {
//         setErrorMessage('Something went wrong while processing your request.')
//         console.error(err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     createLicense()
//   }, [searchParams])

//   return (
//     <div className='bg-primary-foreground fixed inset-0 z-[999] flex flex-col items-center justify-center px-4 text-center'>
//       {errorMessage ? (
//         <>
//           <AlertTriangle className='mb-4 h-10 w-10 text-red-600' />
//           <p className='text-2xl font-semibold text-red-600'>{errorMessage}</p>
//           <Link
//             href='/'
//             className='mt-6 rounded bg-red-600 px-6 py-2 font-medium text-white transition hover:bg-red-700'
//           >
//             Back to Homepage
//           </Link>
//         </>
//       ) : isLoading ? (
//         <>
//           <CircleCheck className='mb-4 h-10 w-10 text-green-600' />
//           <p className='text-2xl font-semibold'>
//             Your payment was successful. We are now retrieving your license. This will only take a moment.
//           </p>
//         </>
//       ) : licenseKey ? (
//         <>
//           <CircleCheck className='mb-4 h-10 w-10 text-green-600' />
//           <p className='text-2xl font-semibold text-green-700'>License has been created successfully!</p>
//           <p className='mt-2 text-lg font-medium'>
//             Your license key is: <span className='font-mono text-blue-700'>{licenseKey}</span>
//           </p>
//           <Link
//             href='/'
//             className='mt-6 rounded bg-green-600 px-6 py-2 font-medium text-white transition hover:bg-green-700'
//           >
//             Back to Homepage
//           </Link>
//         </>
//       ) : null}
//     </div>
//   )
// }
const TIME = 5

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [orderId, setOrderId] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(TIME)
  const [subscriptionId, setSubscriptionId] = useState<number>()
  const hasFetched = useRef(false)

  // Lấy orderId một lần duy nhất từ searchParams
  useEffect(() => {
    const id = searchParams.get('orderCode')
    setOrderId(id)
  }, [searchParams])

  // Gọi API fetchOrder
  useEffect(() => {
    if (!orderId || hasFetched.current) return
    hasFetched.current = true

    const fetchOrder = async () => {
      try {
        const res = await http.get<OrderResponse>(`${LINKS.order}/${orderId}`, {
          baseUrl: '/api',
        })

        if (res?.data?.subscriptionId) {
          setSubscriptionId(res.data.subscriptionId)
        }

        if (res?.data?.paymentStatus === OrderStatusEnum.SUCCESS && res?.data?.licenseCreated === false) {
          const resLicense = await http.put<OrderResponse>(`${LINKS.order_license}/${orderId}`, {
            params: { newStatus: OrderStatusEnum.SUCCESS },
            baseUrl: '/api',
          })

          if (!CODE_SUCCESS.includes(resLicense.code)) {
            toast.warning('License has created with this order')
          } else {
            toast.success(resLicense.message ?? 'License created successfully')
          }
        }

        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(`Not found order ${orderId}`)
        }
      } catch (err) {
        console.error('Not found order:', err)
      }
    }

    fetchOrder()
  }, [orderId])

  useEffect(() => {
    if (!subscriptionId) return

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    const redirectTimer = setTimeout(() => {
      router.push(`/orders/${subscriptionId}?orderId=${orderId}`)
      router.refresh()
    }, TIME * 1000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimer)
    }
  }, [subscriptionId, router, orderId])

  return (
    <div className='bg-primary-foreground fixed inset-0 z-[999] flex flex-col items-center justify-center px-4 text-center'>
      <CircleCheck className='mb-4 h-10 w-10 text-green-600' />
      <p className='text-2xl font-semibold text-green-700'>
        Direct your order {orderId} : {countdown} s
      </p>
      <Link
        href='/'
        className='mt-6 rounded bg-green-600 px-6 py-2 font-medium text-white transition hover:bg-green-700'
      >
        Back to Homepage
      </Link>
    </div>
  )
}
