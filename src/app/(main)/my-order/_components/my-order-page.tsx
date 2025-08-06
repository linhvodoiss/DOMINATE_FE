'use client'
import { OrderResponse } from '#/order'
import { User } from '#/user'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PAGE_SIZE } from '~/constants/paginate'
import { getPaymentStatusText } from '~/constants/statusOrder'
import { useRouter, useSearchParams } from 'next/navigation'

import { OrderStatusEnum } from '#/tabs-order'
import { Input } from '~/components/ui/input'
import OrderStatusTabs from './status-order-user'
import { Search } from 'lucide-react'

interface Props {
  data: OrderResponse[]
  user: User
}

export default function MyOrderPage({ data }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [orders, setOrders] = useState<OrderResponse[]>(data)
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const initialSearch = searchParams.get('search') || ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const status = searchParams.get('status') || OrderStatusEnum.ALL

  const fetchOrders = async (pageNumber: number) => {
    const currentStatus = searchParams.get('status') || OrderStatusEnum.ALL
    const currentSearch = searchParams.get('search') || ''

    const res = await http.get<OrderResponse[]>(`${LINKS.order_user}`, {
      params: {
        page: pageNumber,
        size: PAGE_SIZE,
        status: currentStatus === OrderStatusEnum.ALL ? undefined : currentStatus,
        search: currentSearch || undefined,
      },
      baseUrl: '/api',
    })

    const newOrders = res.content ?? []
    const existingIds = new Set(orders.map(o => o.id))
    const uniqueNew = (newOrders as OrderResponse[]).filter(o => !existingIds.has(o.id))
    setOrders(prev => [...prev, ...uniqueNew] as OrderResponse[])
    setHasMore(newOrders.length === PAGE_SIZE)
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await http.get<OrderResponse[]>(`${LINKS.order_user}`, {
        params: {
          page: 1,
          size: PAGE_SIZE,
          status: status === OrderStatusEnum.ALL ? undefined : status,
          search: status === OrderStatusEnum.ALL && searchTerm ? searchTerm : undefined,
        },
        baseUrl: '/api',
      })
      const newOrders = res?.content ?? []
      setOrders(newOrders as OrderResponse[])
      setPage(2)
      setHasMore(newOrders.length === PAGE_SIZE)
    }

    fetchData()
  }, [status, searchTerm])

  const fetchNext = () => {
    setTimeout(() => {
      fetchOrders(page)
      setPage(prev => prev + 1)
    }, 500)
  }

  // param url search
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }

    router.replace(`?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    const value = target.value.trim()
    if (e.key === 'Enter') {
      setSearchTerm(value)
      handleSearch(value)
    }
  }

  const handleClick = () => {
    const value = inputRef.current?.value.trim() || ''
    setSearchTerm(value)
    handleSearch(value)
  }

  return (
    <div className='mx-auto mt-12 max-w-screen-lg px-4'>
      <OrderStatusTabs setSearchTerm={setSearchTerm} />
      {status === OrderStatusEnum.ALL && (
        <div className='relative'>
          <Input
            ref={inputRef}
            type='text'
            className='my-4 w-full py-6 pr-14 text-sm md:py-3 md:text-base'
            placeholder='You can search by order code or package name...'
            onKeyDown={handleKeyDown}
          />
          <button
            className='text-muted-foreground hover:text-ring absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer p-2'
            onClick={handleClick}
          >
            <Search size={20} />
          </button>
        </div>
      )}

      <InfiniteScroll
        dataLength={orders.length}
        next={fetchNext}
        hasMore={hasMore}
        loader={<p className='mt-4 text-center text-xl'>Loading order ...</p>}
        endMessage={orders.length > 0 ? <p className='mt-4 text-center text-xl'>No more orders.</p> : undefined}
      >
        {orders.length === 0 ? (
          <p className='mt-6 text-center text-2xl text-[#dc3545]'>You have no order.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className='border-border mb-6 rounded-xl border shadow-sm transition hover:shadow-md'>
              {/* Header */}
              <div className='text-muted-foreground flex items-center justify-between border-b px-4 py-3 text-sm font-semibold'>
                <Link href='' className='hover:text-primary'>
                  View product
                </Link>
                <span className='text-yellow-600'>{getPaymentStatusText(order.paymentStatus)}</span>
              </div>

              {/* Content */}
              <div className='flex flex-col items-start gap-4 px-4 py-5 md:flex-row md:items-center'>
                {/* Image */}
                <div className='h-20 w-20 shrink-0 overflow-hidden rounded-md border'>
                  <Image
                    src='https://cdn.pixabay.com/photo/2020/03/31/02/32/package-4986026_640.png'
                    alt='ảnh sản phẩm'
                    width={80}
                    height={80}
                    className='h-full w-full object-contain'
                  />
                </div>

                {/* Info */}
                <div className='flex-1'>
                  {order.subscription ? (
                    <>
                      <h2 className='text-foreground text-base font-semibold md:text-lg'>{order.subscription.name}</h2>
                      <p className='text-muted-foreground text-sm'>{order.subscription.billingCycle}</p>
                      <p className='text-muted-foreground text-sm'>
                        <span className='text-foreground font-medium'>Code:</span> {order.orderId}
                      </p>
                    </>
                  ) : (
                    <div className='text-destructive text-sm'>
                      <p className='text-base font-semibold text-[#dc3545]'>This package is not exist</p>
                      <p className='text-muted-foreground text-sm'>
                        <span className='text-foreground font-medium'>Code:</span> {order.orderId}
                      </p>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className='text-right whitespace-nowrap'>
                  {order.subscription ? (
                    <>
                      <p className='text-primary text-lg font-bold md:text-xl'>
                        {order?.price != null ? order.price.toLocaleString('vi-VN') + ' đ' : '--'}
                      </p>
                    </>
                  ) : (
                    <p className='text-muted-foreground italic'>Price is undefined</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className='flex justify-end border-t px-4 py-4'>
                <div className='flex justify-end border-t px-4 py-4'>
                  {order.subscriptionId ? (
                    <Link
                      href={`/orders/${order.subscriptionId}?orderId=${order.orderId}`}
                      className='bg-primary-system hover:bg-primary-hover inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-medium text-white transition'
                    >
                      View detail
                    </Link>
                  ) : (
                    <span
                      className='inline-flex h-10 cursor-not-allowed items-center justify-center rounded-lg bg-gray-400 px-6 text-sm font-medium text-white'
                      title='This package is not available'
                    >
                      View detail
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </InfiniteScroll>
    </div>
  )
}
