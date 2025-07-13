'use client'
import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import { PaymentResponse } from '#/payment'
import { OrderResponse } from '#/order'
import { CODE_SUCCESS } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import React from 'react'
// import CopyableText from '~/app/_components/copy-text'
import ModalOrder from './modal-order'
import { PackageResponse } from '#/package'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import { env } from '~/configs/env'

interface Props {
  id: string
  isPaymentSubmitted: boolean
  data: PackageResponse
  paymentInfo: PaymentResponse
  paymentMethod: string
  setPaymentInfo: (info: PaymentResponse) => void
  setIsPaymentSubmitted: (state: boolean) => void
}

export default function PayosPayment({
  data,
  paymentInfo,
  setPaymentInfo,
  setIsPaymentSubmitted,
  isPaymentSubmitted,
  id,
  paymentMethod,
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [pending, setPending] = useState(false)

  const onOpenChange = (open: boolean) => setOpen(open)
  const orderHandler = async () => {
    const orderId = Math.floor(100_000_000 + Math.random() * 900_000_000)
    const amount = data.price
    const description = `DOMINATE${orderId}`
    setPending(true)
    startTransition(async () => {
      try {
        const paymentRes = await http.post<PaymentResponse>(LINKS.payment_create, {
          body: JSON.stringify({ orderCode: orderId, amount, description }),
          baseUrl: '/api',
        })

        if (!paymentRes.data?.checkoutUrl) {
          toast.error('Cannot create link payment')
          return
        }

        const orderRes = await http.post<OrderResponse>(LINKS.order, {
          body: JSON.stringify({
            subscriptionId: data.id,
            paymentMethod,
            orderId,
            bin: paymentRes.data.bin,
            accountName: paymentRes.data.accountName,
            accountNumber: paymentRes.data.accountNumber,
            qrCode: paymentRes.data.qrCode,
            paymentLink: paymentRes.data.checkoutUrl,
          }),
          baseUrl: '/api',
        })

        if (!CODE_SUCCESS.includes(orderRes.code) || !orderRes.data) {
          toast.error(orderRes.message || 'Create payment failed')
          return
        }

        toast.success('Create payment successfully')
        setPaymentInfo(paymentRes.data)
        window.open(paymentRes.data.checkoutUrl, '_blank')
        router.push(`/orders/${id}?orderId=${orderRes.data.orderId}`)
        setIsPaymentSubmitted(true)
        setOpen(false)
      } catch (error) {
        console.error(error)
        toast.error('Something wrong with payment')
      } finally {
        setPending(false)
      }
    })
  }

  if (!isPaymentSubmitted || !paymentInfo) {
    return (
      <>
        <div className='mt-4 flex justify-end'>
          <button
            className='bg-primary-system hover:bg-primary-hover cursor-pointer rounded-md px-6 py-2 font-semibold text-white'
            disabled={isPending || isPaymentSubmitted}
            onClick={() => onOpenChange(true)}
          >
            Pay Now
          </button>
        </div>
        <ModalOrder open={open} onOpenChange={onOpenChange} onSubmitOrder={orderHandler} pending={pending} />
      </>
    )
  }

  return (
    <div className='mt-10 rounded-xl border p-4 md:p-6'>
      {paymentInfo?.paymentLink && (
        <Link
          href={paymentInfo.paymentLink}
          target='_blank'
          className='text-primary mb-4 text-center text-lg font-bold underline md:text-left md:text-xl'
        >
          Link PAYOS →
        </Link>
      )}
    </div>
  )
}
