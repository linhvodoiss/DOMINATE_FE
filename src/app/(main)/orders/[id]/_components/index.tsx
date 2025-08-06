'use client'
import { PackageResponse } from '#/package'
import { User } from '#/user'
import React, { useCallback, useEffect, useState } from 'react'

import PayosPayment from './payos-payment'
import { PaymentResponse, ResponseGlobal } from '#/payment'
import { useSearchParams } from 'next/navigation'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { OrderResponse } from '#/order'

import OrderInfo from './info-order'
import Reminder from './reminder'
import { subscribeOnceNoRegister } from '~/app/_components/socket-link'

interface Props {
  data: PackageResponse
  user: User
  id: string
}

export default function OrderPage({ data, user, id }: Props) {
  const searchParams = useSearchParams()
  const [paymentInfo, setPaymentInfo] = useState<ResponseGlobal>()
  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState(false)

  const orderId = searchParams.get('orderId')

  const fetchOrder = useCallback(async () => {
    if (!orderId) return

    try {
      const res = await http.get<OrderResponse>(`${LINKS.order}/${orderId}`, { baseUrl: '/api' })
      if (res && res.data) {
        setIsPaymentSubmitted(true)
        setPaymentInfo({
          description: `DOMINATE${orderId}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(res.data as any),
        })
      }
    } catch (err) {
      console.error('Không tìm thấy đơn hàng:', err)
    } finally {
    }
  }, [orderId])

  useEffect(() => {
    if (orderId) {
      fetchOrder()
      const timeoutId = setTimeout(
        () => {
          fetchOrder()
        },
        1 * 60 * 1000
      )

      return () => clearTimeout(timeoutId)
    }
  }, [orderId, fetchOrder])

  useEffect(() => {
    if (!orderId) return

    const topics = [`/topic/payment/${orderId}`, `/topic/sync/${orderId}`]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let subscriptions: any[] = []

    subscribeOnceNoRegister(client => {
      subscriptions = topics.map(topic =>
        client.subscribe(topic, () => {
          console.log(`Nhận socket từ ${topic} => refetch order`)
          fetchOrder()
        })
      )
    })

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe())
    }
  }, [orderId, fetchOrder])

  return (
    <div className='bg-primary-foreground mx-auto mt-12 w-full max-w-4xl rounded-xl border-2 px-4 py-8 shadow-md md:px-8'>
      <h1 className='text-primary mb-6 text-center text-2xl font-semibold md:text-3xl'>
        Order {orderId ? `${orderId}` : 'Information'}
      </h1>
      <OrderInfo data={data} user={user} />

      <PayosPayment
        id={id}
        data={data}
        paymentInfo={paymentInfo as PaymentResponse}
        setPaymentInfo={setPaymentInfo}
        setIsPaymentSubmitted={setIsPaymentSubmitted}
        isPaymentSubmitted={isPaymentSubmitted}
      />
      <Reminder data={data} paymentInfo={paymentInfo} orderId={orderId} />
    </div>
  )
}
