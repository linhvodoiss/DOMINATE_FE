import { PackageResponse } from '#/package'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import calPriceDiscount from '~/utils/price-discount-calculate'
import OptionList from './_components/list-option'

interface Props {
  params: { id: string }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const { data } = await http.get<PackageResponse>(`${LINKS.detailPackage}/${id}`)
  if (!data) return <p className='mt-20 text-center text-xl text-red-500'>Không tìm thấy dữ liệu gói cước.</p>
  return (
    <div className='mt-12 px-4 md:px-8'>
      <h1 className='text-primary mb-2 text-2xl font-semibold md:text-3xl'>{data?.name}</h1>
      <span className='mb-6 block text-sm md:text-base'>Updated at: {data?.updatedAt}</span>

      <div className='flex w-full flex-col items-start justify-start gap-6 py-6 lg:flex-row'>
        {/* Image */}
        {data.typePackage === 'DEV' ? (
          <div className='bg-primary-foreground aspect-video w-full rounded-xl border p-4 shadow-md sm:w-2/3 lg:w-2/3'>
            <Image
              src='/package/dev_package.png'
              alt='ảnh sản phẩm'
              width={1100}
              height={1280}
              className='size-full object-contain'
            />
          </div>
        ) : (
          <div className='bg-primary-foreground aspect-video w-full rounded-xl border p-4 shadow-md sm:w-2/3 lg:w-2/3'>
            <Image
              src='/package/runtime_package.png'
              alt='ảnh sản phẩm'
              width={1100}
              height={1280}
              className='size-full object-contain'
            />
          </div>
        )}
        {/* Info */}
        <div className='bg-primary-foreground w-full flex-1 rounded-xl border px-6 py-8 text-base shadow-md md:text-lg lg:w-1/3'>
          {/* Price */}
          <p className='flex items-center gap-4 py-2'>
            {data?.discount != null && data.discount > 0 ? (
              <>
                <span className='text-gray-500 line-through'>
                  {data?.price != null ? data.price.toLocaleString('vi-VN') + ' đ' : '--'}
                </span>
                <span className='text-primary text-2xl font-bold'>
                  {data?.price != null
                    ? calPriceDiscount(data.price, data.discount).toLocaleString('vi-VN') + ' đ'
                    : '--'}
                </span>
              </>
            ) : (
              <span className='text-primary text-2xl font-bold'>
                {data?.price != null ? data.price.toLocaleString('vi-VN') + ' đ' : '--'}
              </span>
            )}
          </p>

          {/* Cycle */}
          <p className='py-2'>
            <span className='font-semibold'>Cycle: </span>
            {data?.billingCycle}
          </p>

          {/* Options */}
          <OptionList options={data?.options || []} />
          {/* Order button */}
          <div className='mt-6 w-full'>
            <Link
              href={`/orders/${data?.id}`}
              className='bg-primary-system hover:bg-primary-hover block w-full rounded-2xl py-3 text-center font-semibold text-white transition'
            >
              Order
            </Link>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className='mt-8 w-full text-sm leading-relaxed md:text-base'>
        <h2 className='text-primary mb-4 text-xl font-semibold md:text-2xl'>Package description:</h2>
        <p className='' style={{ whiteSpace: 'pre-line' }}>
          {data.description}
        </p>
      </div>
    </div>
  )
}
