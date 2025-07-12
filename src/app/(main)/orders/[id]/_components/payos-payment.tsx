'use client'
import { useState, useTransition } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { BIN_BANK_MAP } from '~/constants/bank-list'
import { PaymentResponse } from '#/payment'
import { OrderResponse } from '#/order'
import { CODE_SUCCESS } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import React from 'react'
import CopyableText from '~/app/_components/copy-text'
import ModalOrder from './modal-order'
import { PackageResponse } from '#/package'
import { useRouter } from 'next/navigation'
import { env } from '~/configs/env'

interface Props {
  id: string
  data: PackageResponse
  paymentInfo?: PaymentResponse
  paymentMethod: string
  setPaymentInfo: (info: PaymentResponse) => void
  setIsPaymentSubmitted: (state: boolean) => void
}

export default function PayosPayment({
  data,
  paymentInfo,
  setPaymentInfo,
  setIsPaymentSubmitted,
  id,
  paymentMethod,
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const onOpenChange = (open: boolean) => setOpen(open)
  const orderHandler = async () => {
    const orderId = Math.floor(100_000_000 + Math.random() * 900_000_000)
    const amount = data.price
    const description = `DOMINATE_${orderId}`

    startTransition(async () => {
      try {
        const paymentRes = await http.post<PaymentResponse>(LINKS.payment_create, {
          body: JSON.stringify({ orderCode: orderId, amount, description }),
          baseUrl: '/api',
        })

        if (!paymentRes.data?.checkoutUrl) {
          toast.error('Không tạo được link thanh toán')
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
            paymentLink: `${env.APP_URL}${LINKS.order}/${id}?orderId=${orderId}`,
          }),
          baseUrl: '/api',
        })

        if (!CODE_SUCCESS.includes(orderRes.code) || !orderRes.data) {
          toast.error(orderRes.message || 'Tạo đơn hàng thất bại')
          return
        }

        toast.success('Tạo đơn hàng thành công')
        setPaymentInfo(paymentRes.data)
        router.push(`/orders/${id}?orderId=${orderRes.data.orderId}`)
        setIsPaymentSubmitted(true)
        setOpen(false)
      } catch (error) {
        console.error(error)
        toast.error('Đã xảy ra lỗi khi xử lý đơn hàng')
      }
    })
  }

  if (!paymentInfo) {
    return (
      <>
        <div className='mt-4 flex justify-end'>
          <button
            className='bg-primary-system hover:bg-primary-hover cursor-pointer rounded-md px-6 py-2 font-semibold text-white'
            disabled={isPending}
            onClick={() => onOpenChange(true)}
          >
            Pay Now
          </button>
        </div>
        <ModalOrder open={open} onOpenChange={onOpenChange} onSubmitOrder={orderHandler} />
      </>
    )
  }

  return (
    <div className='mt-10 rounded-xl border p-4 shadow md:p-6'>
      <h2 className='text-primary mb-4 text-center text-lg font-bold md:text-left md:text-xl'>
        {BIN_BANK_MAP[paymentInfo.bin]}
      </h2>
      <div className='mb-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:text-base'>
        <CopyableText label='Account name' value={paymentInfo.accountName} />
        <CopyableText label='Account number' value={paymentInfo.accountNumber} />
        <CopyableText label='Description' value={paymentInfo.description} />
        <CopyableText label='Money' value={`${(paymentInfo?.amount ?? data.price).toLocaleString('vi-VN')} đ`} />
      </div>
      <p className='text-destructive my-4 text-center text-sm font-medium'>
        * Note: Please make sure to enter the <span className='font-semibold'>correct payment description</span> and{' '}
        <span className='font-semibold'>exact amount</span> to ensure automatic verification.
      </p>
      <div className='flex flex-col items-center'>
        <QRCodeSVG value={paymentInfo.qrCode} size={192} />
        <p className='text-muted-foreground mt-2 text-sm'>Scan QR for pay</p>
      </div>
    </div>
  )
}
