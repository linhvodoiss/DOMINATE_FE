'use client'

import { LicenseResponse } from '#/licenses'
import { User } from '#/user'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import CustomPagination from '~/components/custom/paginate-custom'
import { Button } from '~/components/ui/button'
import { CODE_SUCCESS } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import ModalTypeActivated from './modal-type-activated'
import Link from 'next/link'
import ActiveTable from './active-table'
import StoredTable from './stored-table'

interface Props {
  data: LicenseResponse[]
  user: User
  totalPages: number
  pageNumber: number
  dataLicenseUsed: LicenseResponse[]
}

export default function LicensePage({ data, totalPages, pageNumber, dataLicenseUsed }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedTypeInModal, setSelectedTypeInModal] = useState<string | undefined>()

  const onOpenChange = (open: boolean) => setOpen(open)

  const activeNext = () => {
    if (!selectedTypeInModal) {
      toast.error('Please choose a license type')
      return
    }
    startTransition(async () => {
      const res = await http.post<LicenseResponse>(`${LINKS.licenses_activate_next}`, {
        params: {
          type: selectedTypeInModal,
        },
        baseUrl: '/api',
      })
      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <div className='bg-primary-foreground mt-12 rounded-2xl border px-4 pt-8 pb-12 shadow-md sm:px-8 md:px-16 lg:px-32'>
      <h2 className='text-primary mb-2 text-2xl font-semibold sm:text-3xl'>Your licenses key</h2>
      <hr className='my-3' />

      {data.length > 0 ? (
        <Button className='mb-6 w-[140px]' disabled={isPending} onClick={() => onOpenChange(true)}>
          Get new key!
        </Button>
      ) : (
        <Link
          href='/product'
          className='text-primary hover:text-primary-hover relative mb-6 inline-block px-2 py-4 font-semibold italic after:absolute after:bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-current'
        >
          Don&apos;t have key, buy now!
        </Link>
      )}

      <div className='overflow-x-auto'>
        <ActiveTable dataLicenseUsed={dataLicenseUsed} />
      </div>
      <div className='overflow-x-auto'>
        <StoredTable data={data} isPending={isPending} />
      </div>

      {(totalPages ?? 0) > 1 && (
        <CustomPagination currentPage={pageNumber ?? 1} totalPages={totalPages ?? 1} containerClass='mt-6' />
      )}

      <ModalTypeActivated
        open={open}
        onOpenChange={setOpen}
        onSubmitOrder={activeNext}
        selectedType={selectedTypeInModal}
        onTypeChange={setSelectedTypeInModal}
        pending={isPending}
      />
    </div>
  )
}
