'use client'
import { Button } from '~/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ThemeChange() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const current = theme === 'system' ? resolvedTheme : theme
  return (
    <Button
      className='hover:!bg-toggle scale-150 !border-none !bg-transparent !text-white'
      variant='outline'
      size='icon'
      aria-label='Toggle theme'
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
    >
      {current === 'dark' ? <Sun className='h-8 w-8' /> : <Moon className='h-8 w-8' />}
    </Button>
  )
}
