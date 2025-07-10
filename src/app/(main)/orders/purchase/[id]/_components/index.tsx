'use client'
import { OrderResponse } from '#/order'
import { User } from '#/user'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PAGE_SIZE } from '~/constants/paginate'
import { getPaymentStatusText } from '~/constants/statusOrder'
import { useRouter, useSearchParams } from 'next/navigation'
import OrderStatusTabs from '~/app/_components/status-order-user'
import { OrderStatusEnum } from '#/tabs-order'
import { Input } from '~/components/ui/input'

interface Props {
  data: OrderResponse[]
  user: User
  id: string
}

export default function PurchasePage({ data, id }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderResponse[]>(data)
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const initialSearch = searchParams.get('search') || ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const status = searchParams.get('status') || OrderStatusEnum.ALL

  const fetchOrders = async (pageNumber: number) => {
    const currentStatus = searchParams.get('status') || OrderStatusEnum.ALL
    const currentSearch = searchParams.get('search') || ''

    const res = await http.get<OrderResponse[]>(`${LINKS.order_user}/${id}`, {
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
      const res = await http.get<OrderResponse[]>(`${LINKS.order_user}/${id}`, {
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
  }, [id, status, searchTerm])

  const fetchNext = () => {
    setTimeout(() => {
      fetchOrders(page)
      setPage(prev => prev + 1)
    }, 2500)
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

  return (
    <div className='mx-auto mt-12'>
      <OrderStatusTabs setSearchTerm={setSearchTerm} />
      {status === OrderStatusEnum.ALL && (
        <Input
          type='text'
          className='my-4 w-full py-6 text-base'
          placeholder='Bạn có thể tìm kiếm theo mã đơn, tên sản phẩm '
          onKeyDown={handleKeyDown}
        />
      )}
      <InfiniteScroll
        dataLength={orders.length}
        next={fetchNext}
        hasMore={hasMore}
        loader={<p className='mt-4 text-center text-xl'>Loading order ...</p>}
        endMessage={orders.length > 0 ? <p className='mt-4 text-center text-xl'>No more orders.</p> : undefined}
      >
        {orders?.length === 0 ? (
          <p className='mt-6 text-center text-2xl text-red-500'>You have no order.</p>
        ) : (
          orders?.map(order => (
            <div key={order.id} className='border-primary bg-primary-foreground mb-4 rounded-xl border-2 p-8 shadow-md'>
              <div className='flex items-center justify-between border-b-2 py-2 text-base'>
                <Link href='' className='hover:bg-primary-foreground-hover p-2 font-semibold'>
                  View product {order.id}
                </Link>
                <span className='text-lg font-bold'>{getPaymentStatusText(order.paymentStatus)}</span>
              </div>
              <div className='flex w-full items-start justify-start border-b-2 py-4'>
                <div className='aspect-square w-20 rounded-md border-2'>
                  <Image
                    src='https://cdn.pixabay.com/photo/2020/03/31/02/32/package-4986026_640.png'
                    alt='ảnh sản phẩm'
                    width={100}
                    height={100}
                    className='size-full object-contain'
                  />
                </div>
                <div className='ml-4'>
                  <h2 className='text-xl font-semibold'>{order.subscription.name}</h2>
                  <p className='text-base'>{order.subscription.billingCycle}</p>
                  <p className='text-base'>
                    <span className='font-semibold'>Code:</span> {order.orderId}
                  </p>
                </div>
                <div className='ml-auto flex items-center gap-2 self-center'>
                  <span className='line-through'>{order.subscription.price} $</span>{' '}
                  <span className='text-2xl font-bold'>{order.subscription.discount} $</span>
                </div>
              </div>
              <div className='mt-4 flex w-full items-center justify-end gap-4 text-base text-white'>
                <button
                  className='hover:bg-primary-hover bg-primary-system w-40 cursor-pointer items-center justify-center rounded-2xl py-4 shadow-md'
                  type='submit'
                  // disabled={isPending}
                >
                  Pay
                </button>
                <Link
                  href='/'
                  className='hover:bg-primary-foreground-hover outline-destructive text-destructive block w-40 cursor-pointer items-center justify-center rounded-2xl py-4 text-center shadow-md outline-2'
                  type='submit'
                >
                  Cancel order
                </Link>
              </div>
            </div>
          ))
        )}
      </InfiniteScroll>
    </div>
  )
}
