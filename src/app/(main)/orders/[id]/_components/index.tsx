'use client'
import { PackageResponse } from '#/package'
import { User } from '#/user'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner'
import ModalOrder from '~/app/_components/modal_order'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { CODE_SUCCESS } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'

interface Props {
  data: PackageResponse
  user: User
}

export default function OrderPage({ data, user }: Props) {
  const [paymentMethod, setPaymentMethod] = React.useState('BANK')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  function onOpenChange(open: boolean) {
    setOpen(open)
  }
  async function orderHandler() {
    const bodyReq = {
      subscriptionId: data.id,
      paymentMethod,
    }
    startTransition(async () => {
      const res = await http.post(LINKS.order, {
        body: JSON.stringify(bodyReq),
        baseUrl: '/api',
      })
      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      router.push('/')
      router.refresh()
    })
  }
  return (
    <div className='bg-primary-foreground mx-auto mt-12 w-2/3 rounded-xl border-2 px-8 pt-8 pb-12 shadow-2xl'>
      <h1 className='text-primary mb-2 p-2 text-center text-3xl font-semibold'>Order Information</h1>
      <div className='flex w-full items-start justify-between'>
        <div className='w-full'>
          <h2 className='text-primary mb-2 p-2 text-xl font-semibold'>Chi tiết đơn hàng</h2>
          <p className='block p-3 text-base'>
            <span className='font-semibold'>Name: </span>
            {data?.name}
          </p>
          <p className='block p-3 text-base'>
            <span className='font-semibold'>Code: </span>
            {data?.id}
          </p>
          <p className='block p-3 text-base'>
            <span className='font-semibold'>Date created: </span>22/02/2019
          </p>
          <p className='block p-3 text-base'>
            <span className='font-semibold'>Price: </span>
            {data?.discount} đ
          </p>
          <p className='block p-3 text-base'>
            <span className='font-semibold'>Cycle: </span>
            {data?.billingCycle}
          </p>
          <p className='block p-3 text-base'>
            <span className='font-semibold'>Profit: </span>
            {data?.options}
          </p>
          <Link
            href={`/${data?.id}`}
            className='hover:bg-primary-foreground-hover text-primary inline-block rounded-md p-3 text-base font-semibold'
          >
            Link product {'>'}
          </Link>
        </div>
        <div className='w-full'>
          <h2 className='text-primary mb-2 p-2 text-xl font-semibold'>Personal information</h2>
          <p className='block p-3 text-base'>
            <span className='font-semibold'>Name: </span>
            {user?.firstName} {user?.lastName}
          </p>
          <p className='block p-3 text-base'>
            <span className='font-semibold'>Phone number: </span>
            {user?.phoneNumber}
          </p>
          <p className='block p-3 text-base'>
            <span className='font-semibold'>Email: </span>
            {user?.email}
          </p>
          <p className='block p-3 text-base'>
            <span className='font-semibold'>Address: </span>Lorem, ipsum dolor sit amet consectetur{' '}
          </p>
          <p className='block p-3 text-base'>
            <span className='font-semibold'>Choose payment method:</span>{' '}
          </p>
          <Select onValueChange={value => setPaymentMethod(value)} defaultValue={paymentMethod}>
            <SelectTrigger className='mt-2 w-full'>
              <SelectValue placeholder='Chọn gói' />
            </SelectTrigger>
            <SelectContent className='w-full'>
              <SelectItem value='BANK'>Bank Transfer</SelectItem>
              <SelectItem value='MOMO'>MOMO</SelectItem>
              <SelectItem value='VNPAY'>VNPAY</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='mt-4 flex w-full items-center justify-center gap-4 text-base text-white'>
        <button
          className='hover:bg-primary-hover bg-primary-system w-40 cursor-pointer items-center justify-center rounded-2xl py-4 font-semibold shadow-md'
          type='submit'
          disabled={isPending}
          onClick={() => onOpenChange(true)}
        >
          Confirm
        </button>
        <Link
          href='/'
          className='hover:bg-primary-foreground-hover outline-destructive text-destructive block w-40 cursor-pointer items-center justify-center rounded-2xl py-4 text-center font-semibold shadow-md outline-2'
          type='submit'
        >
          Cancel
        </Link>
      </div>{' '}
      <ModalOrder open={open} onOpenChange={onOpenChange} onSubmitOrder={orderHandler} />
    </div>
  )
}
