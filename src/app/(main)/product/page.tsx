import { PackageResponse } from '#/package'
import Image from 'next/image'
import Link from 'next/link'
import CustomPagination from '~/components/custom/paginate-custom'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import calPriceDiscount from '~/utils/price-discount-calculate'
import FilterForm from './_components/filter-form'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string; type?: string; search?: string; minPrice?: number; maxPrice?: number }>
}

export default async function ProductPage({ searchParams }: Props) {
  const { page, type, search, minPrice, maxPrice } = await searchParams

  const {
    content = [],
    pageNumber,
    totalPages,
  } = await http.get<PackageResponse>(LINKS.list_package_customer, {
    params: { page, type, search, minPrice, maxPrice },
  })
  const listPackage = content as PackageResponse[]

  return (
    <div className='mt-12 px-4'>
      <h1 className='text-primary mb-8 text-center text-3xl font-semibold'>Packages DOMINATE</h1>
      <FilterForm />

      {listPackage.length === 0 ? (
        <p className='text-primary-system mt-6 text-center text-2xl font-bold'>No package.</p>
      ) : (
        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {listPackage.map(pkg => (
            <div
              key={pkg.id}
              className='bg-background-primary flex flex-col items-center rounded-xl p-6 text-[#e5e5e5] shadow-md transition-shadow hover:shadow-lg'
            >
              <div className='relative mb-2 h-24 w-24'>
                <Image
                  src='https://cdn.pixabay.com/photo/2020/03/31/02/32/package-4986026_640.png'
                  alt='image package'
                  fill
                  className='object-contain'
                />
              </div>

              <h2 className='mt-1 text-center text-lg font-semibold'>
                [{pkg.billingCycle}] {pkg.name}
              </h2>
              {pkg.discount ? (
                <p className='mt-1 flex items-center gap-2 text-base font-bold'>
                  <span className='text-sm font-medium line-through'>{pkg.price} đ</span>
                  <span className='text-base font-bold'>{calPriceDiscount(pkg.price as number, pkg.discount)} đ</span>
                </p>
              ) : (
                <p className='mt-1 text-base font-bold'>{pkg.price} đ</p>
              )}

              <Link
                href={`/product/${pkg.id}`}
                className='bg-primary-foreground hover:bg-primary-foreground-hover text-primary border-primary-system mt-4 w-[140px] rounded-xl border py-2 text-center font-semibold transition'
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
      {(totalPages ?? 0) > 1 && (
        <CustomPagination currentPage={pageNumber ?? 1} totalPages={totalPages ?? 1} containerClass='' />
      )}
    </div>
  )
}
