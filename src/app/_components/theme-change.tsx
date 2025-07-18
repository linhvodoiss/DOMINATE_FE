'use client'

import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ThemeChange({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button
        className='hover:!bg-toggle scale-150 !border-none !bg-transparent !text-white'
        variant='outline'
        size='icon'
        aria-label='Toggle theme'
        disabled
      >
        <Sun className='h-8 w-8 opacity-0' />
      </Button>
    )
  }

  const current = theme === 'system' ? resolvedTheme : theme

  return (
    <Button
      className={`hover:!bg-toggle scale-150 !border-none !bg-transparent !text-white ${className}`}
      variant='outline'
      size='icon'
      aria-label='Toggle theme'
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
    >
      {current === 'dark' ? <Sun className='h-8 w-8' /> : <Moon className='h-8 w-8' />}
    </Button>
  )
}
