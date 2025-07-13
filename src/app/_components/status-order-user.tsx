'use client'

import { cn } from '~/utils/cn'
import { useRouter, useSearchParams } from 'next/navigation'
import { OrderStatusEnum } from '#/tabs-order'

const TABS = [
  { label: 'Tất cả', value: OrderStatusEnum.ALL, href: '?status=' },
  { label: 'Đang xử lý', value: OrderStatusEnum.PENDING, href: '?status=PENDING' },
  { label: 'Chờ thanh toán', value: OrderStatusEnum.PROCESSING, href: '?status=PROCESSING' },
  { label: 'Đã thanh toán', value: OrderStatusEnum.SUCCESS, href: '?status=SUCCESS' },
  { label: 'Đã hủy', value: OrderStatusEnum.FAILED, href: '?status=FAILED' },
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
    <div className='bg-primary-foreground mb-4 flex h-16 w-full items-center border-2 text-center'>
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
  )
}
