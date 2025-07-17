'use client'
import { LicenseResponse } from '#/licenses'
import { User } from '#/user'
import clsx from 'clsx'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import CustomPagination from '~/components/custom/paginate-custom'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { CODE_SUCCESS } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import ModalTypeActivated from './modal-type-activated'

interface Props {
  id: string
  data: LicenseResponse[]
  user: User
  totalPages: number
  pageNumber: number
  dataLicenseUsed: LicenseResponse[]
}

export default function LicensePage({ data, id, user, totalPages, pageNumber, dataLicenseUsed }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [type, chooseType] = useState<string | undefined>(searchParams.get('type') || undefined)
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')
  const [open, setOpen] = useState<boolean>(false)
  const onOpenChange = (open: boolean) => setOpen(open)

  const handleSearch = () => {
    const params = new URLSearchParams()

    params.set('page', '1')
    if (search) params.set('search', search)
    if (type && type !== 'ALL') params.set('type', type)

    router.push(`?${params.toString()}`)
  }
  const activeNext = () => {
    startTransition(async () => {
      const res = await http.post<LicenseResponse>(`${LINKS.licenses_activate_next}/${id}`, {
        params: {
          type: 'DEV',
        },
        baseUrl: '/api',
      })
      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      router.refresh()
    })
  }

  return (
    <div className='bg-primary-foreground mt-12items-center mt-12 gap-4 rounded-2xl border-[1px] px-32 pt-8 pb-12 shadow-md'>
      <h2 className='text-primary text-start text-3xl font-semibold'>Your licenses key</h2>
      <hr className='mt-3 mb-3' />
      <Button className='mb-6 w-[140px] py-4' disabled={isPending} onClick={() => onOpenChange(true)}>
        Get new key!
      </Button>
      <div className='mb-6'>
        <h2 className='mb-1 text-lg font-semibold'>Key are using</h2>
        <table className='border-primary-system min-w-full border text-sm'>
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
            {dataLicenseUsed.map((license, index) => (
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
                <td className='border p-2'>{license.daysLeft <= 0 ? 'License cant used' : 'License are activated'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className='mb-1 text-lg font-semibold'>Stored key</h2>
      <div className='mb-3 flex w-full max-w-[700px] items-center gap-4'>
        <Input
          type='text'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='text-base'
          placeholder='Search license key...'
          classNameWrap='flex-1'
        />
        <Select onValueChange={chooseType} value={type}>
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder='Filter type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>All</SelectItem>
            <SelectItem value='DEV'>Dev</SelectItem>
            <SelectItem value='RUNTIME'>Runtime</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className='w-[100px]' disabled={isPending}>
          Search
        </Button>
      </div>
      <table className='border-primary-system min-w-full border text-sm'>
        <thead>
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

      {totalPages > 1 && <CustomPagination currentPage={pageNumber} totalPages={totalPages} containerClass='' />}
      <ModalTypeActivated
        open={open}
        onOpenChange={setOpen}
        onSubmitOrder={activeNext}
        // pending={pending}
      />
    </div>
  )
}
