'use client'

import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { PaymentResponse } from '#/payment'
import { OrderResponse } from '#/order'
import { PackageResponse } from '#/package'
import { OrderStatusEnum } from '#/tabs-order'
import { CODE_SUCCESS } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import ModalOrder from './modal-order'
import calPriceDiscount from '~/utils/price-discount-calculate'

type ModalType = 'create' | 'cancel' | null

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
  const searchParams = useSearchParams()
  const [modalType, setModalType] = useState<ModalType>(null)
  const [isPending, startTransition] = useTransition()
  const [pending, setPending] = useState(false)

  // -------------------- CREATE ORDER --------------------
  const orderHandler = async () => {
    const orderId = Math.floor(100_000_000 + Math.random() * 900_000_000)
    const amount = calPriceDiscount(data.price as number, data.discount as number)
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
        setModalType(null)
      } catch (error) {
        console.error(error)
        toast.error('Something went wrong with payment')
      } finally {
        setPending(false)
      }
    })
  }

  // -------------------- CLOSE MODAL FROM WEBSOCKET --------------------
  useEffect(() => {
    setModalType(null)
  }, [paymentInfo])

  // -------------------- CANCEL ORDER --------------------
  const cancelOrderHandler = (newStatus: OrderStatusEnum) => {
    const existingOrderId = searchParams.get('orderId')
    const reason = 'Customer cancel order'
    if (!existingOrderId) {
      toast.error('Missing order ID')
      return
    }
    setPending(true)
    startTransition(async () => {
      try {
        // API cancel POS
        const resPayOS = await http.post(`${LINKS.payment_cancel}/${existingOrderId}`, {
          params: {
            reason,
          },
          baseUrl: '/api',
        })
        if (!CODE_SUCCESS.includes(resPayOS.code)) {
          toast.error(resPayOS.message || 'Order cancel failed')
          return
        }
        // API cancel system
        const res = await http.patch<OrderResponse>(`${LINKS.order}/${existingOrderId}`, {
          params: { newStatus },
          baseUrl: '/api',
        })

        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Order cancel failed')
          return
        }

        toast.success(resPayOS.message)
        setIsPaymentSubmitted(true)
        setModalType(null)
        router.refresh()
      } catch (err) {
        console.error('Error update status:', err)
        toast.error('Something went wrong when canceling order')
      } finally {
        setPending(false)
      }
    })
  }

  // -------------------- MODAL CONFIG --------------------
  const modalConfig = {
    create: {
      title: 'PAY CONFIRM',
      content: 'Are you sure to confirm paid?',
      onSubmit: orderHandler,
    },
    cancel: {
      title: 'Cancel this order?',
      content: 'Press OK to confirm cancellation.',
      onSubmit: () => cancelOrderHandler(OrderStatusEnum.FAILED),
    },
  } as const

  // -------------------- RENDER --------------------
  if (!isPaymentSubmitted || !paymentInfo) {
    return (
      <>
        <div className='mt-4 flex justify-end'>
          <button
            className='bg-primary-system hover:bg-primary-hover cursor-pointer rounded-md px-6 py-2 font-semibold text-white'
            disabled={isPending || isPaymentSubmitted}
            onClick={() => setModalType('create')}
          >
            Pay Now
          </button>
        </div>
        {modalType && (
          <ModalOrder
            open={!!modalType}
            onOpenChange={open => !open && setModalType(null)}
            title={modalConfig[modalType].title}
            content={modalConfig[modalType].content}
            onSubmitOrder={modalConfig[modalType].onSubmit}
            pending={pending}
          />
        )}
      </>
    )
  }

  return (
    <div className='mt-10 rounded-xl border p-4 md:p-6'>
      {paymentInfo?.paymentStatus === OrderStatusEnum.PENDING && paymentInfo?.paymentLink && (
        <div className='mb-4 flex items-center gap-4'>
          <Link
            href={paymentInfo.paymentLink}
            target='_blank'
            className='text-primary text-center text-lg font-bold underline md:text-left md:text-xl'
          >
            Link PAYOS →
          </Link>
          <button
            className='text-destructive border-destructive hover:bg-primary-foreground-hover cursor-pointer rounded-md border px-6 py-2 font-semibold'
            disabled={isPending}
            onClick={() => setModalType('cancel')}
          >
            Cancel
          </button>
        </div>
      )}

      <div className='mt-2'>
        {paymentInfo.paymentStatus === OrderStatusEnum.PENDING && (
          <span className='font-bold text-blue-600'>Waiting for confirmation...</span>
        )}
        {paymentInfo.paymentStatus === OrderStatusEnum.SUCCESS && (
          <>
            <span className='mb-3 block font-bold text-[#198754]'>Payment successful!</span>
            <span className='hover:text-primary-system relative inline-block -translate-y-2 font-medium'>
              Your license key: {paymentInfo?.license?.licenseKey} <br />
              Type: {paymentInfo?.subscription?.typePackage}
            </span>
          </>
        )}
        {paymentInfo.paymentStatus === OrderStatusEnum.FAILED && (
          <>
            <span className='mb-3 block font-bold text-[#dc3545]'>Your order has been cancelled.</span>
            <Link
              href={`product/${data?.id}`}
              className='text-primary hover:text-primary-hover relative block -translate-y-2 font-medium underline'
            >
              Reorder →
            </Link>
          </>
        )}
      </div>

      {modalType && (
        <ModalOrder
          open={!!modalType}
          onOpenChange={open => !open && setModalType(null)}
          title={modalConfig[modalType].title}
          content={modalConfig[modalType].content}
          onSubmitOrder={modalConfig[modalType].onSubmit}
          pending={pending}
        />
      )}
    </div>
  )
}
