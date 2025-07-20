'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Switch, theme as antdTheme } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'

export default function ThemeChange({ className = '' }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const {} = antdTheme.useToken()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Switch
        className={className}
        checkedChildren={<SunOutlined />}
        unCheckedChildren={<MoonOutlined className='!text-black' />}
        disabled
      />
    )
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme
  const isDark = currentTheme === 'dark'

  return (
    <Switch
      className={className}
      checked={isDark}
      onChange={() => setTheme(isDark ? 'light' : 'dark')}
      checkedChildren={<SunOutlined />}
      unCheckedChildren={<MoonOutlined className='!text-black' />}
      style={{ backgroundColor: isDark ? '#555' : '#ccc' }}
    />
  )
}
