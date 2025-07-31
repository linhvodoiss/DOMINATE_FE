import { PackageResponse } from '#/package'
import Image from 'next/image'
import Link from 'next/link'
import CustomPagination from '~/components/custom/paginate-custom'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import calPriceDiscount from '~/utils/price-discount-calculate'
import FilterForm from './_components/filter-form'
import { billingCycleMap } from '~/constants/package-type'

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
              {pkg.typePackage === 'DEV' ? (
                <div className='relative mb-2 h-24 w-24'>
                  <Image
                    src='/package/dev_package.png'
                    alt='image package'
                    width={1100}
                    height={1280}
                    className='object-contain'
                  />
                </div>
              ) : (
                <div className='relative mb-2 h-24 w-24'>
                  <Image
                    src='/package/runtime_package.png'
                    alt='image package'
                    width={1100}
                    height={1280}
                    className='object-contain'
                  />
                </div>
              )}

              <h2 className='mt-1 text-center text-lg font-semibold'>
                [{billingCycleMap[pkg.billingCycle as string] || pkg.billingCycle}] {pkg.name}
              </h2>
              {pkg.discount != null && pkg.discount > 0 ? (
                <p className='mt-1 flex items-center gap-2 text-base font-bold'>
                  <span className='text-sm font-medium text-gray-500 line-through'>
                    {pkg.price != null ? pkg.price.toLocaleString('vi-VN') + ' đ' : '--'}
                  </span>
                  <span className='text-base font-bold'>
                    {pkg.price != null
                      ? calPriceDiscount(pkg.price, pkg.discount).toLocaleString('vi-VN') + ' đ'
                      : '--'}
                  </span>
                </p>
              ) : (
                <p className='mt-1 text-base font-bold'>
                  {pkg.price != null ? pkg.price.toLocaleString('vi-VN') + ' đ' : '--'}
                </p>
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
