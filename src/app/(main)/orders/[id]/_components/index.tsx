'use client'
import { PackageResponse } from '#/package'
import { User } from '#/user'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import BankTransferPayment from './bank-payment'
import PayosPayment from './payos-payment'
import { PaymentResponse } from '#/payment'
import { useSearchParams } from 'next/navigation'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { OrderResponse } from '#/order'

interface Props {
  data: PackageResponse
  user: User
  id: string
}

export default function OrderPage({ data, user, id }: Props) {
  const searchParams = useSearchParams()
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(undefined)
  const [paymentInfo, setPaymentInfo] = useState<PaymentResponse>()
  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [updateTrigger, setUpdateTrigger] = useState(false)

  const orderId = searchParams.get('orderId')
  useEffect(() => {
    if (!orderId) {
      setIsLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {
        const res = await http.get<OrderResponse>(`${LINKS.order}/${orderId}`, { baseUrl: '/api' })
        if (res && res.data) {
          setPaymentMethod(res.data.paymentMethod)
          setIsPaymentSubmitted(true)
          setPaymentInfo({
            description: `DOMINATE_${orderId}`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(res.data as any),
          })
        }
      } catch (err) {
        console.error('Không tìm thấy đơn hàng:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, updateTrigger])
  return (
    <div className='bg-primary-foreground mx-auto mt-12 w-full max-w-4xl rounded-xl border-2 px-4 py-8 shadow-2xl md:px-8'>
      <h1 className='text-primary mb-6 text-center text-2xl font-semibold md:text-3xl'>Order Information</h1>

      <div className='flex flex-col md:flex-row md:gap-6'>
        <div className='w-full'>
          <p className='mb-3'>
            <span className='font-semibold'>Customer name:</span> {user?.firstName} {user?.lastName}
          </p>
          <p className='mb-3'>
            <span className='font-semibold'>Product:</span> {data?.name}
          </p>
          <p className='mb-3'>
            <span className='font-semibold'>Price:</span> {data?.price} đ
          </p>
          <p className='mb-3'>
            <span className='font-semibold'>Cycle:</span> {data?.billingCycle}
          </p>
        </div>

        <div className='w-full'>
          <p className='mb-3'>
            <span className='font-semibold'>Profit:</span> {data?.options}
          </p>
          <Link href={`/${data?.id}`} className='text-primary mb-3 block font-semibold hover:underline'>
            Link product {'>'}
          </Link>
          <label className='mb-2 block font-semibold'>Choose payment method:</label>
          <Select
            onValueChange={value => setPaymentMethod(value)}
            value={paymentMethod}
            disabled={isLoading || isPaymentSubmitted}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Chọn phương thức' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='BANK'>Bank Transfer</SelectItem>
              <SelectItem value='PAYOS'>PAYOS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {paymentMethod === 'PAYOS' && (
        <PayosPayment
          id={id}
          data={data}
          paymentInfo={paymentInfo}
          setPaymentInfo={setPaymentInfo}
          setIsPaymentSubmitted={setIsPaymentSubmitted}
          paymentMethod={paymentMethod}
        />
      )}

      {paymentMethod === 'BANK' && (
        <BankTransferPayment
          id={id}
          amount={data.price as number}
          paymentInfo={paymentInfo as PaymentResponse}
          data={data}
          paymentMethod={paymentMethod}
          setIsPaymentSubmitted={setIsPaymentSubmitted}
          triggerUpdate={() => setUpdateTrigger(prev => !prev)}
        />
      )}

      <div className='mt-6 flex justify-center'>
        <Link
          href='/'
          className='text-destructive hover:bg-primary-foreground-hover border-destructive w-40 rounded-lg border py-3 text-center font-semibold shadow-sm'
        >
          Back
        </Link>
      </div>
    </div>
  )
}
