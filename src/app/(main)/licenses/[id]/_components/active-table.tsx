import { LicenseResponse } from '#/licenses'
import clsx from 'clsx'
import { useState, useTransition } from 'react'
import { Button } from '~/components/ui/button'
import ModalBind from './modal-bind'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { useRouter } from 'next/navigation'
import { CODE_SUCCESS } from '~/constants'
import { toast } from 'sonner'

export default function ActiveTable({ dataLicenseUsed }: { dataLicenseUsed: LicenseResponse[] }) {
  const [openBind, setOpenBind] = useState<boolean>(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const onOpenChangeBind = (openBind: boolean) => setOpenBind(openBind)
  const unbindHandler = (item: string) => {
    startTransition(async () => {
      const res = await http.patch(`${LINKS.licenses_unbind}`, {
        params: {
          licenseKey: item,
        },
        baseUrl: '/api',
      })
      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      setOpenBind(false)
      router.refresh()
    })
  }
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
              <th className='border p-2'>Device</th>
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
                  <td className='max-w-40 overflow-x-auto border p-2'>
                    {license.hardwareId ? license.hardwareId : 'No connect any device'}
                  </td>
                  {license.hardwareId && (
                    <td className='border p-2 text-center'>
                      <Button
                        className='w-[100px] cursor-pointer bg-[#dc3545] text-white hover:bg-red-600'
                        onClick={() => onOpenChangeBind(true)}
                      >
                        Remove
                      </Button>
                      <ModalBind
                        open={openBind}
                        onOpenChange={setOpenBind}
                        unbindHandler={() => unbindHandler(license.licenseKey)}
                        pending={isPending}
                      />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
