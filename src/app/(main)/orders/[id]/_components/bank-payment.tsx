'use client'

import { QRCodeSVG } from 'qrcode.react'
import CopyableText from '~/app/_components/copy-text'
import ModalOrder from './modal-order'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { PackageResponse } from '#/package'
import { OrderResponse } from '#/order'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { CODE_SUCCESS } from '~/constants'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import { mockPaymentInfo } from '~/constants/mock-payment-tranfer'
import { env } from '~/configs/env'
import { PaymentResponse } from '#/payment'
import { OrderStatusEnum } from '#/tabs-order'
import Link from 'next/link'
import { User } from '#/user'
import { LicenseResponse } from '#/licenses'

type ModalType = 'create' | 'confirm-paid' | 'cancel' | null

interface Props {
  id: string
  isPaymentSubmitted: boolean
  amount: number
  data: PackageResponse
  paymentMethod: string
  paymentInfo: PaymentResponse
  user: User
  setIsPaymentSubmitted: (state: boolean) => void
}

export default function BankTransferPayment({
  data,
  paymentMethod,
  id,
  user,
  setIsPaymentSubmitted,
  isPaymentSubmitted,
  paymentInfo,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [modalType, setModalType] = useState<ModalType>(null)
  const [isPending, startTransition] = useTransition()
  const [pending, setPending] = useState(false)
  const [licenseKey, setLicenseKey] = useState('')

  const existingOrderId = searchParams.get('orderId')
  const tempOrderId = useMemo(() => {
    return existingOrderId ? parseInt(existingOrderId) : Math.floor(10_000_000 + Math.random() * 90_000_000)
  }, [existingOrderId])

  const hasCalledLicense = useRef(false)

  useEffect(() => {
    const createLicense = async () => {
      const fixedIp = '192.168.1.100'
      const fixedHardwareId = 'ABCDEF123456'

      if (!existingOrderId || hasCalledLicense.current) return

      try {
        const resLis = await http.post<LicenseResponse>(LINKS.licenses_create, {
          body: JSON.stringify({
            orderId: existingOrderId,
            ip: fixedIp,
            hardwareId: fixedHardwareId,
          }),
          baseUrl: '/api',
        })

        if (!CODE_SUCCESS.includes(resLis.code)) {
          toast.error(resLis.message || 'Failed to create license')
          return
        }

        setLicenseKey(resLis?.data?.licenseKey as string)
        toast.success(resLis.message || 'License created successfully.')
        hasCalledLicense.current = true
      } catch (error) {
        console.error('License creation failed:', error)
        toast.error('Something went wrong when creating license')
      }
    }

    if (paymentInfo?.paymentStatus === OrderStatusEnum.SUCCESS) {
      createLicense()
    }
  }, [existingOrderId, paymentInfo?.paymentStatus])

  // -------------------- ORDER CREATION --------------------
  const orderHandler = async () => {
    const orderId = tempOrderId
    const description = `DOMINATE${orderId}BANK`
    setPending(true)

    startTransition(async () => {
      try {
        const orderRes = await http.post<OrderResponse>(LINKS.order, {
          body: JSON.stringify({
            subscriptionId: data.id,
            paymentMethod,
            orderId,
            description,
            bin: mockPaymentInfo.bin,
            accountName: mockPaymentInfo.accountName,
            accountNumber: mockPaymentInfo.accountNumber,
            qrCode: mockPaymentInfo.qrCode,
            paymentLink: `${env.APP_URL}${LINKS.order}/${id}?orderId=${orderId}`,
          }),
          baseUrl: '/api',
        })

        if (!CODE_SUCCESS.includes(orderRes.code) || !orderRes.data) {
          toast.error(orderRes.message || 'Create payment failed')
          return
        }

        toast.success('Create payment successfully')
        router.push(`/orders/${data.id}?orderId=${orderRes.data.orderId}`)
        setIsPaymentSubmitted(true)
        setModalType(null)
      } catch (error) {
        console.error(error)
        toast.error('Something went wrong')
      } finally {
        setPending(false)
      }
    })
  }

  // -------------------- UPDATE STATUS --------------------
  const handleUpdateOrderStatus = (newStatus: OrderStatusEnum) => {
    const existingOrderId = searchParams.get('orderId')
    const userEmail = user.email

    if (!existingOrderId || !userEmail) {
      toast.error('Missing order information or email')
      return
    }

    setPending(true)
    startTransition(async () => {
      try {
        const res = await http.patch<OrderResponse>(`${LINKS.order}/${existingOrderId}`, {
          params: { newStatus },
          baseUrl: '/api',
        })

        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Action failed')
          return
        }

        let resEmailUser: { message?: string; code?: number } | null = null

        if (newStatus === OrderStatusEnum.PROCESSING) {
          const [userRes, adminRes] = await Promise.all([
            http.post(LINKS.order_email, {
              params: {
                email: user.email,
                packageId: data.id,
                orderId: parseInt(existingOrderId),
              },
              baseUrl: '/api',
            }),
            http.post(LINKS.order_email_admin, {
              params: {
                email: env.ADMIN_MAIL,
                packageId: data.id,
                orderId: parseInt(existingOrderId),
              },
              baseUrl: '/api',
            }),
          ])

          resEmailUser = userRes

          if (!CODE_SUCCESS.includes(userRes.code || 0) || !CODE_SUCCESS.includes(adminRes.code || 0)) {
            toast.error('Send email failed')
            return
          }
        }

        const messSuccess =
          newStatus === OrderStatusEnum.PROCESSING
            ? resEmailUser?.message || 'Marked as paid'
            : 'Order has been cancelled'

        toast.success(messSuccess)
        setIsPaymentSubmitted(true)
        setModalType(null)
        router.refresh()
      } catch (err) {
        console.error('Error update status:', err)
        toast.error('Something went wrong when updating status')
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
    'confirm-paid': {
      title: 'Have you paid?',
      content: 'Press OK to confirm and notify admin',
      onSubmit: () => handleUpdateOrderStatus(OrderStatusEnum.PROCESSING),
    },
    cancel: {
      title: 'Are you sure to cancel this order?',
      content: 'Press OK to confirm',
      onSubmit: () => handleUpdateOrderStatus(OrderStatusEnum.FAILED),
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
    <div className='mt-10 rounded-xl border p-4 shadow md:p-6'>
      <div className='mb-4 flex items-center gap-4'>
        <h2 className='text-primary text-center text-lg font-bold md:text-left md:text-xl'>VietinBank</h2>
        {paymentInfo.paymentStatus === OrderStatusEnum.PROCESSING ? (
          <span className='font-bold text-blue-600'>Have paid, waiting for confirmation...</span>
        ) : paymentInfo.paymentStatus === OrderStatusEnum.SUCCESS ? (
          <span className='font-bold text-[#198754]'>Payment successful!</span>
        ) : paymentInfo.paymentStatus === OrderStatusEnum.FAILED ? (
          <div className='flex flex-col items-start gap-2'>
            <span className='font-bold text-[#dc3545]'>Your order has been cancelled.</span>
          </div>
        ) : (
          <div className='flex items-center gap-4'>
            <button
              className='bg-primary-system hover:bg-primary-hover cursor-pointer rounded-md px-6 py-2 font-semibold text-white'
              disabled={isPending}
              onClick={() => setModalType('confirm-paid')}
            >
              Have paid?
            </button>
            <button
              className='text-destructive border-destructive hover:bg-primary-foreground-hover cursor-pointer rounded-md border px-6 py-2 font-semibold'
              disabled={isPending}
              onClick={() => setModalType('cancel')}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {paymentInfo.paymentStatus === OrderStatusEnum.SUCCESS && (
        <span className='text-primary hover:text-primary-hover relative block -translate-y-2 font-medium underline'>
          Your license key: {licenseKey}
        </span>
      )}
      {paymentInfo.paymentStatus === OrderStatusEnum.FAILED && (
        <Link
          href={`product/${data?.id}`}
          className='text-primary hover:text-primary-hover relative block -translate-y-2 font-medium underline'
        >
          Reorder →
        </Link>
      )}

      <div className='mb-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:text-base'>
        <CopyableText label='Account name' value={paymentInfo.accountName} />
        <CopyableText label='Account number' value={paymentInfo.accountNumber} />
        <CopyableText label='Description' value={`${paymentInfo.description}BANK`} />
        <CopyableText label='Money' value={`${(paymentInfo?.amount ?? data.price).toLocaleString('vi-VN')} đ`} />
      </div>

      <p className='text-destructive my-4 text-center text-sm font-medium'>
        * Note: Please make sure to enter the <span className='font-semibold'>correct payment description</span> and{' '}
        <span className='font-semibold'>exact amount</span>.
      </p>

      <div className='flex flex-col items-center'>
        <QRCodeSVG value={paymentInfo.qrCode} size={100} />
        <p className='text-muted-foreground mt-2 text-sm'>Scan QR for pay</p>
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
