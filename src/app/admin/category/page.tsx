import { LINKS } from '~/constants/links'
import http from '~/utils/http'

import CategoryPage from './_components/category-page'
import { CategoryResponse } from '#/category'
interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    page?: string
    search?: string
    isActive?: boolean
    sort?: string
    size?: number
    versionId?: number
  }>
}

export default async function Page({ searchParams }: Props) {
  const { page, search, isActive, sort, size, versionId } = await searchParams

  const {
    content = [],
    pageNumber,
    pageSize,
    totalElements,
  } = await http.get<CategoryResponse>(LINKS.categories, {
    params: { page, search, isActive, sort, size, versionId },
  })
  const listCategory = content as CategoryResponse[]

  return (
    <CategoryPage
      listCategory={listCategory}
      pageNumber={pageNumber as number}
      pageSize={pageSize as number}
      totalElements={totalElements as number}
    />
  )
}
