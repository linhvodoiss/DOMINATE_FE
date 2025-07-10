'use client'
import { useTransition } from 'react'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { useRouter } from 'next/navigation'

export default function LogoutBtn() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const logoutHandler = () => {
    startTransition(async () => {
      await http.post(LINKS.logout_api, { baseUrl: 'api/auth' })
      router.push('/')
      router.refresh()
    })
  }
  return (
    <button
      disabled={isPending}
      className='border-primary-system text-primary hover:bg-primary-mute w-full cursor-pointer py-2'
      onClick={logoutHandler}
    >
      Logout
    </button>
  )
}
