import { PackageResponse } from '#/package'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import calPriceDiscount from '~/utils/price-discount-calculate'

interface Props {
  params: { id: string }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const { data } = await http.get<PackageResponse>(`${LINKS.detailPackage}/${id}`)

  return (
    <div className='mt-12'>
      <h1 className='text-primary mb-4 text-3xl font-semibold'>{data?.name}</h1>
      <span className='mb-4 block text-base'>Updated at: {data?.updatedAt}</span>
      <div className='flex w-full items-start justify-start gap-4 py-6'>
        <div className='bg-primary-foreground aspect-video w-2/3 rounded-xl border-2 p-4 shadow-md'>
          <Image
            src='https://cdn.pixabay.com/photo/2020/03/31/02/32/package-4986026_640.png'
            alt='ảnh sản phẩm'
            width={100}
            height={100}
            className='size-full object-contain'
          />
        </div>
        <div className='bg-primary-foreground h-full w-1/3 flex-1 rounded-xl border-2 px-8 pt-8 pb-12 text-lg shadow-md'>
          <p className='flex items-center justify-start gap-4 py-2'>
            {data?.discount ? (
              <>
                <span className='line-through'>{data?.price} đ</span>
                <span className='text-2xl font-bold'>
                  {calPriceDiscount(data?.price as number, data?.discount as number)} đ
                </span>
              </>
            ) : (
              <span className='text-2xl font-bold'>{data?.price} đ</span>
            )}
          </p>

          <p className='py-2'>
            <span className='font-semibold'>Cycle: </span>
            {data?.billingCycle}
          </p>
          <div className='py-2'>
            <span className='font-semibold'>Profit: </span>
            <ul className='text-base'>
              {data?.options?.map(option => (
                <li key={option.id} className='block'>
                  {option.name}
                </li>
              ))}
            </ul>
          </div>
          <div className='mt-4 flex w-full items-center justify-between gap-4 text-base text-white shadow-md'>
            <Link
              href={`/orders/${data?.id}`}
              className='hover:bg-primary-hover bg-primary-system w-full cursor-pointer items-center justify-center rounded-2xl py-4 text-center font-semibold'
              type='submit'
            >
              Order
            </Link>
          </div>
          {/* <p className='py-2'>
            Mô tả: {data?.options} Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias libero quos accusamus
            omnis vel debitis, vitae autem voluptatum corporis, nulla, fugiat mollitia officiis fugit! Facilis modi
            possimus at quia accusantium!
          </p> */}
        </div>
      </div>
      <div className='mt-4 w-full text-base'>
        <h2 className='text-primary mb-4 text-2xl font-semibold'>Product description:</h2>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum, voluptatibus reprehenderit itaque dicta
          impedit tempore aliquam eaque magnam quod labore eius, nemo ipsa voluptas commodi? Illum doloribus voluptatem
          a excepturi! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum, voluptatibus reprehenderit
          itaque dicta impedit tempore aliquam eaque magnam quod labore eius, nemo ipsa voluptas commodi? Illum
          doloribus voluptatem a excepturi! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum,
          voluptatibus reprehenderit itaque dicta impedit tempore aliquam eaque magnam quod labore eius, nemo ipsa
          voluptas commodi? Illum doloribus voluptatem a excepturi! Lorem ipsum dolor, sit amet consectetur adipisicing
          elit. Voluptatum, voluptatibus reprehenderit itaque dicta impedit tempore aliquam eaque magnam quod labore
          eius, nemo ipsa voluptas commodi? Illum doloribus voluptatem a excepturi!
        </p>
      </div>
    </div>
  )
}
