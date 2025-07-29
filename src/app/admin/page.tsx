import { LINKS } from '~/constants/links'
import http from '~/utils/http'

import { DashBoardResponse } from '#/dashboard'
import DashBoardPage from './_components/dashboard-page'

export default async function Page() {
  const { data } = await http.get<DashBoardResponse>(LINKS.account_dashboard)

  return <DashBoardPage data={data} />
}
