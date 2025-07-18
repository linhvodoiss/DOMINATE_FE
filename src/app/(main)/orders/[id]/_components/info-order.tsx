import { PackageResponse } from '#/package'
import { User } from '#/user'
import Link from 'next/link'
import React from 'react'
import calPriceDiscount from '~/utils/price-discount-calculate'
interface Props {
  data: PackageResponse
  user: User
}
export default function OrderInfo({ data, user }: Props) {
  return (
    <div className='flex flex-col md:flex-row md:gap-6'>
      <div className='w-full'>
        <p className='mb-3'>
          <span className='font-semibold'>Customer name:</span> {user?.firstName} {user?.lastName}
        </p>
        <p className='mb-3'>
          <span className='font-semibold'>Product:</span> {data?.name}
        </p>
        <p className='mb-3'>
          <span className='flex items-center gap-2 font-semibold'>
            Price:
            {data?.discount ? (
              <>
                <span className='line-through'>{data?.price} đ</span>
                <span className='font-bold'>{calPriceDiscount(data?.price as number, data?.discount as number)} đ</span>
              </>
            ) : (
              <span className='font-bold'>{data?.price} đ</span>
            )}
          </span>
        </p>

        <p className='mb-3'>
          <span className='font-semibold'>Cycle:</span> {data?.billingCycle}
        </p>
      </div>

      <div className='w-full'>
        <div className='mb-3'>
          <span className='font-semibold'>Profit:</span>
          {data?.options?.map(option => (
            <li key={option.id} className='block'>
              - {option.name}
            </li>
          ))}
        </div>
        <Link href={`/${data?.id}`} className='text-primary mb-3 block font-semibold hover:underline'>
          Link product {'>'}
        </Link>
      </div>
    </div>
  )
}
