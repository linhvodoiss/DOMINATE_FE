import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import OptionPage from './_components/order-page'
import { OrderResponse } from '#/order'
interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    page?: string
    search?: string
    sort?: string
    status?: string
    type?: string
    size?: number
  }>
}

export default async function Page({ searchParams }: Props) {
  const { page, search, sort, status, type, size } = await searchParams

  const {
    content = [],
    pageNumber,
    pageSize,
    totalElements,
  } = await http.get<OrderResponse>(LINKS.order, {
    params: { page, search, sort, status, type, size },
  })
  const listOrder = content as OrderResponse[]

  return (
    <OptionPage
      listOrder={listOrder}
      pageNumber={pageNumber as number}
      pageSize={pageSize as number}
      totalElements={totalElements as number}
    />
  )
}
