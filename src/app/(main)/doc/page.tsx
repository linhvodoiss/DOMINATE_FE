import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import DocPage from './_components'
import { DocsCustomerResponse } from '#/doc'

export default async function Page() {
  const { data = [] } = await http.get<DocsCustomerResponse[]>(LINKS.docs_customer)
  const listDoc = data as DocsCustomerResponse[]

  return <DocPage listDoc={listDoc} />
}
