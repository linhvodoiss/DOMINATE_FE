import React from 'react'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import DashBoardPage from './_components'
import { DashBoardResponse } from '#/dashboard'

export default async function Page() {
  const { data } = await http.get<DashBoardResponse>(LINKS.account_dashboard)

  return <DashBoardPage data={data} />
}
