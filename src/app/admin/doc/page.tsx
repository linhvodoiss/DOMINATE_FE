import { LINKS } from '~/constants/links'
import http from '~/utils/http'

import { DocResponse } from '#/doc'
import DocPage from './_components/doc-page'
interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    page?: string
    search?: string
    isActive?: boolean
    sort?: string
    size?: number
    categoryId?: number
    versionId?: number
  }>
}

export default async function Page({ searchParams }: Props) {
  const { page, search, isActive, sort, size, categoryId, versionId } = await searchParams

  const {
    content = [],
    pageNumber,
    pageSize,
    totalElements,
  } = await http.get<DocResponse>(LINKS.docs, {
    params: { page, search, isActive, sort, size, categoryId, versionId },
  })
  const listDoc = content as DocResponse[]

  return (
    <DocPage
      listDoc={listDoc}
      pageNumber={pageNumber as number}
      pageSize={pageSize as number}
      totalElements={totalElements as number}
    />
  )
}
