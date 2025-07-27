'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { User } from '#/user'

import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { toast } from 'sonner'
import { disconnectSocket, initSocket, subscribeOnce } from './socket-link'

type AuthContextType = {
  user?: User
  setUser: (user?: User) => void
}

type AuthProviderType = {
  children: ReactNode
  token?: string
  user?: User
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setUser: () => {},
})

export const AuthProvider = ({ children, user: initialUser, token }: AuthProviderType) => {
  const [user, setUser] = useState<User | undefined>(initialUser)
  const router = useRouter()

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    if (token && initialUser) {
      setUser(initialUser)

      try {
        const decoded = jwtDecode<{ exp: number }>(token)
        const now = Math.floor(Date.now() / 1000)
        const expiresIn = decoded.exp - now

        if (expiresIn > 0) {
          timeout = setTimeout(() => {
            console.log('Token expired – redirecting to login...')
            setUser(undefined)
            router.push('/login')
          }, expiresIn * 1000)
        } else {
          setUser(undefined)
          router.push('/login')
        }
      } catch (err) {
        console.error('Token decode failed:', err)
        setUser(undefined)
        router.push('/login')
      }
    } else {
      setUser(undefined)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [token, initialUser, router])

  useEffect(() => {
    if (!user) {
      disconnectSocket()
      return
    }

    initSocket()

    const hasLoggedOutRef = { current: false }

    const logoutHandler = async () => {
      if (hasLoggedOutRef.current) return
      hasLoggedOutRef.current = true

      try {
        await http.post(LINKS.logout_api, { baseUrl: 'api/auth' })
        disconnectSocket()
        toast.error('Have something wrong with your account.')
        setUser(undefined)
        router.push('/login')
      } catch (err) {
        console.error('Failed to logout:', err)
      }
    }

    subscribeOnce(`/topic/user-status/${user.id}`, client => {
      client.subscribe(`/topic/user-status/${user.id}`, message => {
        try {
          const payload = JSON.parse(message.body)
          console.log('WebSocket message received:', payload)
          const isUserAffected = payload.userId === user.id
          const isDeactivated = payload.isActive === false || payload.status === 'NOT_ACTIVE'
          if (isUserAffected && isDeactivated) {
            logoutHandler()
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
        }
      })
    })
  }, [user, router])

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
