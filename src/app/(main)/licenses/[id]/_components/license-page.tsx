'use client'
import { LicenseResponse } from '#/licenses'
import { User } from '#/user'
import clsx from 'clsx'
import CustomPagination from '~/components/custom/paginate-custom'
interface Props {
  id: string
  data: LicenseResponse[]
  user: User
  totalPages: number
  pageNumber: number
}
export default function LicensePage({ data, id, user, totalPages, pageNumber }: Props) {
  console.log(totalPages, pageNumber)

  return (
    <div className='bg-primary-foreground mt-12items-center mt-12 gap-4 rounded-2xl border-[1px] px-32 pt-8 pb-12 shadow-md'>
      <h2 className='text-primary text-start text-3xl font-semibold'>Your licenses key</h2>
      <hr className='mt-3 mb-6' />
      <div></div>
      <table className='border-primary-system min-w-full border text-sm'>
        <thead className=''>
          <tr>
            <th className='border p-2'>#</th>
            <th className='border p-2'>License Key</th>
            <th className='border p-2'>Type</th>
            <th className='border p-2'>Duration</th>
            <th className='border p-2'>Created</th>
            <th className='border p-2'>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((license, index) => (
            <tr
              key={license.id}
              className={clsx('hover:bg-toggle-secondary border-2', {
                'bg-[#dc3545]/30 hover:!bg-[#dc3545]/30': license.daysLeft <= 0,
              })}
            >
              <td className='border p-2 text-center'>{index + 1}</td>
              <td className='border p-2 font-mono'>{license.licenseKey}</td>
              <td className='border p-2'>{license.subscription.typePackage}</td>
              <td className='border p-2'>{license.duration}</td>
              <td className='border p-2'>{license.createdAt.split(' ')[0]}</td>
              <td className='border p-2'>{license.daysLeft <= 0 ? 'License cant active anymore' : 'Stored'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <CustomPagination currentPage={pageNumber} totalPages={totalPages} containerClass='' />
    </div>
  )
}
