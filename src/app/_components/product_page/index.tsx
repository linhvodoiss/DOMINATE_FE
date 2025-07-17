import { PackageResponse } from '#/package'
import Image from 'next/image'
import Link from 'next/link'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'

export default async function ProductPage() {
  const { content = [] } = await http.get<PackageResponse>(LINKS.listPackage)
  const listPackage = content as PackageResponse[]

  return (
    <div className='mt-12 px-4'>
      <h1 className='text-primary mb-8 text-center text-3xl font-semibold'>Các gói automate cơ bản</h1>

      {listPackage.length === 0 ? (
        <p className='mt-6 text-center text-2xl text-red-500'>No package.</p>
      ) : (
        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {listPackage.map(pkg => (
            <div
              key={pkg.id}
              className='bg-background-primary flex flex-col items-center rounded-xl p-6 text-[#e5e5e5] shadow-md transition-shadow hover:shadow-lg'
            >
              <h2 className='mb-2 text-center text-lg font-semibold'>{pkg.name}</h2>

              <div className='relative mb-4 h-24 w-24'>
                <Image
                  src='https://cdn.pixabay.com/photo/2020/03/31/02/32/package-4986026_640.png'
                  alt='ảnh sản phẩm'
                  fill
                  className='object-contain'
                />
              </div>
              <p className='mt-1 text-base font-bold'>{pkg.price} $</p>

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
    </div>
  )
}
