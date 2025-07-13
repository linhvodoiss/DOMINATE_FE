'use client'
import { QRCodeSVG } from 'qrcode.react'
import CopyableText from '~/app/_components/copy-text'
import ModalOrder from './modal-order'
import { useMemo, useState, useTransition } from 'react'
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

interface Props {
  id: string
  amount: number
  data: PackageResponse
  paymentMethod: string
  paymentInfo: PaymentResponse
  setIsPaymentSubmitted: (state: boolean) => void
  triggerUpdate: () => void
}

export default function BankTransferPayment({
  amount,
  data,
  paymentMethod,
  id,
  setIsPaymentSubmitted,
  paymentInfo,
  triggerUpdate,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const onOpenChange = (open: boolean) => setOpen(open)
  const existingOrderId = searchParams.get('orderId')
  const tempOrderId = useMemo(() => {
    return existingOrderId ? parseInt(existingOrderId) : Math.floor(10_000_000 + Math.random() * 90_000_000)
  }, [existingOrderId])
  console.log(paymentInfo?.paymentStatus)
  ////////////////////////////////////////PAID//////////////////////////////////
  const orderHandler = async () => {
    const orderId = tempOrderId
    const description = `DOMINATE${orderId}BANK`

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
          toast.error(orderRes.message || 'Tạo đơn hàng thất bại')
          return
        }

        toast.success('Tạo đơn hàng thành công')
        router.push(`/orders/${data.id}?orderId=${orderRes.data.orderId}`)
        setIsPaymentSubmitted(true)
        setOpen(false)
      } catch (error) {
        console.error(error)
        toast.error('Đã xảy ra lỗi khi xử lý đơn hàng')
      }
    })
  }
  //////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////UPDATE STATUS////////////////////////////
  const handleUpdateOrderStatus = (newStatus: OrderStatusEnum) => {
    const existingOrderId = searchParams.get('orderId')
    if (!existingOrderId) {
      toast.error('Không tìm thấy orderId')
      return
    }

    startTransition(async () => {
      try {
        const res = await http.patch<OrderResponse>(`${LINKS.order}/${existingOrderId}`, {
          params: { newStatus },
          baseUrl: '/api',
        })

        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Cập nhật trạng thái thất bại')
          return
        }

        toast.success('Cập nhật trạng thái thành công')
        triggerUpdate()
        setIsPaymentSubmitted(true)
        router.refresh()
      } catch (err) {
        console.error('Lỗi cập nhật trạng thái:', err)
        toast.error('Lỗi xảy ra khi cập nhật trạng thái')
      }
    })
  }

  ////////////////////////////////////////////////////////////////////////////////
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
              onClick={() => handleUpdateOrderStatus(OrderStatusEnum.PROCESSING)}
            >
              Have paid?
            </button>
            <button
              className='text-destructive border-destructive hover:bg-primary-foreground-hover cursor-pointer rounded-md border px-6 py-2 font-semibold'
              disabled={isPending}
              onClick={() => handleUpdateOrderStatus(OrderStatusEnum.FAILED)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <Link
        href={`/licenses/hihi`} //
        className='text-primary hover:text-primary-hover relative block -translate-y-2 font-medium underline'
      >
        View your license key →
      </Link>
      <div className='mb-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:text-base'>
        <CopyableText label='Account name' value={mockPaymentInfo.accountName} />
        <CopyableText label='Account number' value={mockPaymentInfo.accountNumber} />
        <CopyableText label='Description' value={`DOMINATE${tempOrderId}BANK`} />
        <CopyableText label='Money' value={`${amount.toLocaleString('vi-VN')} đ`} />
      </div>
      <p className='text-destructive my-4 text-center text-sm font-medium'>
        * Note: Please make sure to enter the <span className='font-semibold'>correct payment description</span> and{' '}
        <span className='font-semibold'>exact amount</span>.
      </p>
      <div className='flex flex-col items-center'>
        <QRCodeSVG value={mockPaymentInfo.qrCode} size={192} />
        <p className='text-muted-foreground mt-2 text-sm'>Scan QR for pay</p>
      </div>
    </div>
  )
}
