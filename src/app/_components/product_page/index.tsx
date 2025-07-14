// 'use client'

// import React, { useEffect, useState } from 'react'
import { PackageResponse } from '#/package'
import Image from 'next/image'
import Link from 'next/link'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export default async function ProductPage() {
  const { content = [] } = await http.get<PackageResponse>(LINKS.listPackage)
  const listPackage = content as PackageResponse[]
  return (
    <div className='mt-12'>
      <h1 className='text-primary text-3xl font-semibold'>Các gói automate cơ bản</h1>
      {listPackage.length === 0 ? (
        <p className='mt-6 text-center text-2xl text-red-500'>No package.</p>
      ) : (
        <div className='mt-4 grid grid-cols-12 gap-8'>
          {listPackage.map(pkg => (
            <div
              className='bg-background-primary col-span-4 flex flex-col items-center rounded-md p-4 text-[#e5e5e5]'
              key={pkg.id}
            >
              <h2 className='text-xl font-semibold'>{pkg.name}</h2>
              <div className='my-2 aspect-square w-1/2'>
                <Image
                  src='https://cdn.pixabay.com/photo/2020/03/31/02/32/package-4986026_640.png'
                  alt='ảnh sản phẩm'
                  width={100}
                  height={100}
                  className='w-full object-cover'
                />
              </div>
              <p className='text-base'>Cycle {pkg.billingCycle}</p>

              <p className='text-base'>{pkg.price} $</p>
              <Link
                href={`/product/${pkg.id}`}
                className='bg-primary-foreground hover:bg-primary-foreground-hover text-primary border-primary-system mt-4 flex w-1/2 cursor-pointer items-center justify-center rounded-2xl border-2 py-4 font-semibold'
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
