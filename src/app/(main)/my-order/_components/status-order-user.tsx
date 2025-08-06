'use client'

import { cn } from '~/utils/cn'
import { useRouter, useSearchParams } from 'next/navigation'
import { OrderStatusEnum } from '#/tabs-order'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '~/components/ui/select'
import { Label } from '~/components/ui/label'

const TABS = [
  { label: 'All', value: OrderStatusEnum.ALL },
  { label: 'Pending', value: OrderStatusEnum.PENDING },
  { label: 'Processing', value: OrderStatusEnum.PROCESSING },
  { label: 'Success', value: OrderStatusEnum.SUCCESS },
  { label: 'Cancel', value: OrderStatusEnum.FAILED },
]

export default function OrderStatusTabs({ setSearchTerm }: { setSearchTerm: (val: string) => void }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentStatus = searchParams.get('status') || OrderStatusEnum.ALL

  const handleTabClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')

    if (value === OrderStatusEnum.ALL) {
      params.delete('status')
    } else {
      params.set('status', value)
    }

    setSearchTerm('')
    router.replace(`?${params.toString()}`)
  }

  return (
    <div className='mb-4 w-full'>
      {/* Mobile: dropdown select */}
      <div className='flex md:hidden'>
        <Label className='w-24 text-base text-nowrap'>Status: </Label>
        <Select value={currentStatus} onValueChange={handleTabClick}>
          <SelectTrigger className='w-full !py-6'>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>
          <SelectContent>
            {TABS.map(tab => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: tab bar */}
      <div className='bg-primary-foreground hidden h-16 items-center border-2 text-center md:flex'>
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={cn(
              'hover:text-ring flex h-[110%] w-full cursor-pointer items-center justify-center border-b-4 py-3 font-semibold',
              currentStatus === tab.value ? 'text-ring border-ring' : 'text-muted-foreground border-transparent'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
