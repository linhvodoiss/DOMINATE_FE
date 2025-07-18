import { LicenseResponse } from '#/licenses'
import clsx from 'clsx'

export default function ActiveTable({ dataLicenseUsed }: { dataLicenseUsed: LicenseResponse[] }) {
  return (
    <div className='mb-6'>
      <h2 className='mb-1 text-lg font-semibold'>Key are using</h2>
      <div className='overflow-x-auto rounded-md border'>
        <table className='w-full min-w-[700px] border-collapse text-sm'>
          <thead>
            <tr>
              <th className='border p-2'>#</th>
              <th className='border p-2'>License Key</th>
              <th className='border p-2'>Type</th>
              <th className='border p-2'>Day left</th>
              <th className='border p-2'>Activated at</th>
              <th className='border p-2'>Status</th>
            </tr>
          </thead>
          <tbody>
            {dataLicenseUsed.length === 0 ? (
              <tr>
                <td className='text-muted-foreground border p-4 text-center' colSpan={6}>
                  You don&apos;t have any active license keys.
                </td>
              </tr>
            ) : (
              dataLicenseUsed.map((license, index) => (
                <tr
                  key={license.id}
                  className={clsx('border-2 bg-[#198754]/30', {
                    'bg-[#dc3545]/30 hover:!bg-[#dc3545]/30': license.daysLeft <= 0,
                  })}
                >
                  <td className='border p-2 text-center'>{index + 1}</td>
                  <td className='border p-2 font-mono'>{license.licenseKey}</td>
                  <td className='border p-2'>{license.subscription.typePackage}</td>
                  <td className='border p-2'>{license.daysLeft}</td>
                  <td className='border p-2'>{license.createdAt.split(' ')[0]}</td>
                  <td className='border p-2'>{license.daysLeft <= 0 ? 'Key can’t be used' : 'Key is activated'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
