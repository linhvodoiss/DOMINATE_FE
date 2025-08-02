'use client'
import { useTransition } from 'react'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { useRouter } from 'next/navigation'
import { disconnectSocket } from '../../../_components/socket-link'

export default function LogoutBtn() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const logoutHandler = () => {
    startTransition(async () => {
      await http.post(LINKS.logout_api, { baseUrl: '/api/auth' })
      router.push('/')
      disconnectSocket()
      router.refresh()
    })
  }
  return (
    <button
      disabled={isPending}
      className='hover:bg-primary-mute w-full cursor-pointer border-b border-white/20 px-4 pt-4 pb-2 text-start'
      onClick={logoutHandler}
    >
      Logout
    </button>
  )
}
