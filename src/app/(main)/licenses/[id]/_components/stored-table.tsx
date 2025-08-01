import { LicenseResponse } from '#/licenses'
import clsx from 'clsx'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

interface Props {
  data: LicenseResponse[]
  isPending: boolean
}

export default function StoredTable({ data, isPending }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [type, chooseType] = useState<string | undefined>(searchParams.get('type') || undefined)
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.set('page', '1')
    if (search) params.set('search', search)
    if (type && type !== 'ALL') params.set('type', type)
    router.push(`?${params.toString()}`)
  }

  return (
    <>
      <h2 className='mb-1 text-lg font-semibold'>Stored key</h2>
      <div className='mb-3 flex w-full flex-col gap-3 sm:max-w-[700px] sm:flex-row sm:items-center'>
        <div className='flex w-full flex-1 gap-3'>
          <Input
            type='text'
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Search license key...'
            className='text-base'
            classNameWrap='w-2/3 '
          />
          <Select onValueChange={chooseType} value={type}>
            <SelectTrigger className='w-1/3'>
              <SelectValue placeholder='Filter type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ALL'>All</SelectItem>
              <SelectItem value='DEV'>Dev</SelectItem>
              <SelectItem value='RUNTIME'>Runtime</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSearch} className='w-[100px]' disabled={isPending}>
          Search
        </Button>
      </div>
      <div className='overflow-x-auto rounded-md border'>
        <table className='w-full min-w-[700px] border-collapse text-sm'>
          <thead>
            <tr>
              <th className='border p-2'>#</th>
              <th className='border p-2'>License Key</th>
              <th className='border p-2'>Type</th>
              <th className='border p-2'>Day lefts</th>
              <th className='border p-2'>Created</th>
              <th className='border p-2'>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td className='text-muted-foreground border p-4 text-center' colSpan={6}>
                  You don&apos;t have any license keys.
                </td>
              </tr>
            ) : (
              data.map((license, index) => (
                <tr
                  key={license.id}
                  className={clsx('hover:bg-toggle-secondary border-2', {
                    'bg-[#dc3545]/30 hover:!bg-[#dc3545]/30': license.daysLeft <= 0,
                    'bg-[#198754]/30 hover:!bg-[#198754]/30': license.canUsed,
                  })}
                >
                  <td className='border p-2 text-center'>{index + 1}</td>
                  <td className='border p-2 font-mono'>{license.licenseKey}</td>
                  <td className='border p-2'>{license.subscription.typePackage}</td>
                  <td className='border p-2'>{license.daysLeft}</td>
                  <td className='border p-2'>{license.createdAt.split(' ')[0]}</td>
                  <td className='border p-2'>
                    {license.daysLeft <= 0
                      ? "Key can't activate anymore"
                      : license.canUsed
                        ? 'Key is activated'
                        : 'Stored'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
