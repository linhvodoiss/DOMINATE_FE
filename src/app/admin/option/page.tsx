import { LINKS } from '~/constants/links'
import http from '~/utils/http'

import { OptionResponse } from '#/option'
import OptionPage from './_components/option-page'
interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    page?: string
    search?: string
    isActive?: boolean
    sort?: string
  }>
}

export default async function ProductPage({ searchParams }: Props) {
  const { page, search, isActive, sort } = await searchParams

  const {
    content = [],
    pageNumber,
    pageSize,
    totalElements,
  } = await http.get<OptionResponse>(LINKS.options, {
    params: { page, search, isActive, sort },
  })
  const listOption = content as OptionResponse[]

  return (
    <OptionPage
      listOption={listOption}
      pageNumber={pageNumber as number}
      pageSize={pageSize as number}
      totalElements={totalElements as number}
    />
  )
}
