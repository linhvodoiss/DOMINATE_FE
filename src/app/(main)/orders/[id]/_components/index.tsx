'use client'
import { PackageResponse } from '#/package'
import { User } from '#/user'
import Link from 'next/link'
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import BankTransferPayment from './bank-payment'
import PayosPayment from './payos-payment'
import { PaymentResponse } from '#/payment'

interface Props {
  data: PackageResponse
  user: User
}

export default function OrderPage({ data, user }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(undefined)
  const [paymentInfo, setPaymentInfo] = useState<PaymentResponse>()
  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState(false)

  return (
    <div className='bg-primary-foreground mx-auto mt-12 w-full max-w-4xl rounded-xl border-2 px-4 py-8 shadow-2xl md:px-8'>
      <h1 className='text-primary mb-6 text-center text-2xl font-semibold md:text-3xl'>Order Information</h1>

      <div className='flex flex-col gap-6 md:flex-row'>
        <div className='w-full'>
          <h2 className='text-primary mb-4 text-xl font-semibold'>Product</h2>
          <p className='mb-3'>
            <span className='font-semibold'>Name:</span> {data?.name}
          </p>
          <p className='mb-3'>
            <span className='font-semibold'>Date created:</span> 22/02/2019
          </p>
          <p className='mb-3'>
            <span className='font-semibold'>Price:</span> {data?.price} đ
          </p>
          <p className='mb-3'>
            <span className='font-semibold'>Cycle:</span> {data?.billingCycle}
          </p>
          <p className='mb-4'>
            <span className='font-semibold'>Profit:</span> {data?.options}
          </p>
          <Link href={`/${data?.id}`} className='text-primary font-semibold hover:underline'>
            Link product {'>'}
          </Link>
        </div>

        <div className='w-full'>
          <h2 className='text-primary mb-4 text-xl font-semibold'>Personal</h2>
          <p className='mb-3'>
            <span className='font-semibold'>Name:</span> {user?.firstName} {user?.lastName}
          </p>
          <p className='mb-3'>
            <span className='font-semibold'>Phone number:</span> {user?.phoneNumber}
          </p>
          <p className='mb-3'>
            <span className='font-semibold'>Email:</span> {user?.email}
          </p>
          <p className='mb-3'>
            <span className='font-semibold'>Address:</span> Lorem, ipsum dolor sit amet consectetur
          </p>

          <label className='mb-2 block font-semibold'>Choose payment method:</label>
          <Select onValueChange={value => setPaymentMethod(value)} value={paymentMethod} disabled={isPaymentSubmitted}>
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
          data={data}
          paymentInfo={paymentInfo}
          setPaymentInfo={setPaymentInfo}
          setIsPaymentSubmitted={setIsPaymentSubmitted}
        />
      )}

      {paymentMethod === 'BANK' && <BankTransferPayment amount={data.price as number} />}

      <div className='mt-6 flex justify-center'>
        <Link
          href='/'
          className='text-destructive hover:bg-primary-foreground-hover border-destructive w-40 rounded-lg border py-3 text-center font-semibold shadow-sm'
        >
          Cancel
        </Link>
      </div>
    </div>
  )
}
