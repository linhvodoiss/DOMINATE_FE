'use client'

import { ConfigProvider, theme } from 'antd'
import { useEffect, useState } from 'react'
import { LoadingFallback } from '~/app/_components/page-content'

export default function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const updateTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    }

    updateTheme()
    setHydrated(true)

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  if (!hydrated) return <LoadingFallback />

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: 'var(--primary)',
          colorBgBase: 'var(--background)',
          colorText: 'var(--foreground)',
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
