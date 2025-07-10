'use client'
import dynamic from 'next/dynamic'
import type { ThemeProviderProps } from 'next-themes'
import { LoadingFallback } from './page-content'

const NextThemesProvider = dynamic(() => import('next-themes').then(mod => mod.ThemeProvider), {
  ssr: false,
  loading: () => <LoadingFallback />,
})

export function ThemeProvider(props: ThemeProviderProps) {
  return <NextThemesProvider {...props} />
}
