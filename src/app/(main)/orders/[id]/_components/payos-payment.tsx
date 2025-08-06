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
import { BIN_BANK_MAP } from '~/constants/bank-list'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

type ModalType = 'create' | 'cancel' | null

interface Props {
  id: string
  isPaymentSubmitted: boolean
  data: PackageResponse
  paymentInfo: PaymentResponse
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
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [modalType, setModalType] = useState<ModalType>(null)
  const [isPending, startTransition] = useTransition()
  const [pending, setPending] = useState(false)

  // form cancel
  const ReasonSchema = z.object({
    reason: z.string().min(1, 'No empty').max(100, 'Max 100 character'),
  })

  type ReasonData = z.infer<typeof ReasonSchema>

  const form = useForm<ReasonData>({
    resolver: zodResolver(ReasonSchema),
    defaultValues: {
      reason: '',
    },
  })

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
            paymentMethod: 'PAYOS',
            orderId,
            // bin: paymentRes.data.bin,
            // accountName: paymentRes.data.accountName,
            // accountNumber: paymentRes.data.accountNumber,
            // qrCode: paymentRes.data.qrCode,
            paymentLink: paymentRes.data.checkoutUrl,
            price: calPriceDiscount(data.price as number, data.discount as number),
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
  const cancelOrderHandler = form.handleSubmit(async values => {
    const existingOrderId = searchParams.get('orderId')
    const newStatus = OrderStatusEnum.FAILED

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
            reason: values.reason,
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
  })

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
      onSubmit: cancelOrderHandler,
    },
  } as const

  // -------------------- RENDER --------------------
  if (!isPaymentSubmitted || !paymentInfo) {
    return (
      <>
        <div className='mt-4 flex justify-start'>
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
    <>
      <div className='mt-2 rounded-xl border p-4 md:p-6'>
        <h2 className='mb-3 py-2 text-xl font-semibold'>Bill Payment</h2>

        {paymentInfo.accountName ? (
          <div className='flex flex-col md:flex-row md:gap-6'>
            <div className='w-full'>
              <p className='mb-3'>
                <span className='font-semibold'>Account Name:</span> {paymentInfo.accountName}
              </p>
              <p className='mb-3'>
                <span className='font-semibold'>Account Number:</span> {paymentInfo.accountNumber}
              </p>
              <p className='mb-3'>
                <span className='font-semibold'>Account Bank:</span>{' '}
                {paymentInfo.bin && BIN_BANK_MAP[paymentInfo.bin]
                  ? BIN_BANK_MAP[paymentInfo.bin]
                  : paymentInfo.bin || '--'}
              </p>
            </div>

            <div className='w-full'>
              <p className='mb-3'>
                <span className='flex items-center gap-2 font-semibold'>
                  Price:
                  <span className='text-primary font-bold'>
                    {paymentInfo.price != null ? paymentInfo.price.toLocaleString('vi-VN') + ' đ' : '--'}
                  </span>
                </span>
              </p>
              <p className='mb-3'>
                <span className='font-semibold'>Date transfer:</span> {paymentInfo.dateTransfer || '--'}
              </p>
            </div>
          </div>
        ) : paymentInfo.paymentStatus === OrderStatusEnum.SUCCESS && !paymentInfo.accountName ? (
          <p className='text-center text-lg font-semibold text-green-600'>
            Something error from PayOS. Your order is confirmed
          </p>
        ) : paymentInfo.paymentStatus === OrderStatusEnum.FAILED ? (
          <div className='w-full'>
            <p className='mb-3'>
              <span className='font-semibold'>Reason cancel:</span> {paymentInfo.cancelReason}
            </p>
            <p className='mb-3'>
              <span className='font-semibold'>Date cancel:</span> {paymentInfo.dateTransfer}
            </p>
          </div>
        ) : (
          <p className='text-center text-lg font-semibold'>No information!</p>
        )}
      </div>
      <div className='mt-2 rounded-xl border p-4 md:p-6'>
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
          {(paymentInfo.paymentStatus === OrderStatusEnum.PENDING ||
            paymentInfo.paymentStatus === OrderStatusEnum.PROCESSING) && (
            <span className='font-bold text-blue-600'>Waiting for confirmation...</span>
          )}
          {paymentInfo.paymentStatus === OrderStatusEnum.SUCCESS && (
            <>
              <span className='mb-3 block font-bold text-[#198754]'>Payment successful!</span>
              {paymentInfo.license ? (
                <span className='hover:text-primary-system relative inline-block -translate-y-2 font-medium'>
                  Your license key: {paymentInfo?.license?.licenseKey} <br />
                  Type: {paymentInfo?.subscription?.typePackage}
                </span>
              ) : (
                <span className='relative inline-block -translate-y-2 font-medium'>
                  Your license key is can&apos;t created, remind admin
                </span>
              )}
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
            form={form}
            isCancel
          />
        )}
      </div>
    </>
  )
}
