import { PackageResponse } from '#/package'

import { LINKS } from '~/constants/links'
import http from '~/utils/http'

import PackagePage from './_components/package-page'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    page?: string
    type?: string
    cycle?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    size?: number
    isActive?: boolean
    sort?: string
  }>
}

export default async function ProductPage({ searchParams }: Props) {
  const { page, type, cycle, search, minPrice, maxPrice, size, isActive, sort } = await searchParams

  const {
    content = [],
    pageNumber,
    pageSize,
    totalElements,
  } = await http.get<PackageResponse>(LINKS.listPackage, {
    params: { page, type, search, minPrice, maxPrice, size, cycle, isActive, sort },
  })
  const listPackage = content as PackageResponse[]

  return (
    <PackagePage
      listPackage={listPackage}
      pageNumber={pageNumber as number}
      pageSize={pageSize as number}
      totalElements={totalElements as number}
    />
  )
}
