'use client'

import { PackageResponse } from '#/package'
import { User } from '#/user'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import calPriceDiscount from '~/utils/price-discount-calculate'

interface Props {
  data: PackageResponse
  user: User
}

export default function OrderInfo({ data, user }: Props) {
  const [showAll, setShowAll] = useState(false)

  const visibleOptions = showAll ? data?.options : data?.options?.slice(0, 3)
  const hasMore = (data?.options?.length || 0) > 3

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
            {data?.discount != null && data.discount > 0 ? (
              <>
                <span className='text-gray-500 line-through'>
                  {data?.price != null ? data.price.toLocaleString('vi-VN') + ' đ' : '--'}
                </span>
                <span className='text-primary font-bold'>
                  {data?.price != null
                    ? calPriceDiscount(data.price, data.discount).toLocaleString('vi-VN') + ' đ'
                    : '--'}
                </span>
              </>
            ) : (
              <span className='text-primary font-bold'>
                {data?.price != null ? data.price.toLocaleString('vi-VN') + ' đ' : '--'}
              </span>
            )}
          </span>
        </p>

        <p className='mb-3'>
          <span className='font-semibold'>Cycle:</span> {data?.billingCycle}
        </p>
      </div>

      <div className='w-full'>
        <div className='mb-3'>
          <span className='block font-semibold'>Profit:</span>
          <ul className='max-h-40 overflow-y-auto'>
            {visibleOptions?.map(option => (
              <li key={option.id} className='flex items-center gap-2'>
                <CheckCircle className='h-4 w-4 flex-shrink-0 text-[#198754]' /> {option.name}
              </li>
            ))}
          </ul>
          {hasMore && (
            <button
              onClick={() => setShowAll(prev => !prev)}
              className='text-primary mt-1 font-semibold hover:underline'
            >
              {showAll ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        <Link href={`/product/${data?.id}`} className='text-primary mb-3 block font-semibold hover:underline'>
          Link product {'>'}
        </Link>
      </div>
    </div>
  )
}
