'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { User } from '#/user'

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

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
