import { LINKS } from '~/constants/links'
import http from '~/utils/http'

import OptionPage from './_components/version-page'
import { VersionResponse } from '#/version'
interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    page?: string
    search?: string
    isActive?: boolean
    sort?: string
    size?: number
  }>
}

export default async function Page({ searchParams }: Props) {
  const { page, search, isActive, sort, size } = await searchParams

  const {
    content = [],
    pageNumber,
    pageSize,
    totalElements,
  } = await http.get<VersionResponse>(LINKS.versions, {
    params: { page, search, isActive, sort, size },
  })
  const listVersion = content as VersionResponse[]

  return (
    <OptionPage
      listVersion={listVersion}
      pageNumber={pageNumber as number}
      pageSize={pageSize as number}
      totalElements={totalElements as number}
    />
  )
}
