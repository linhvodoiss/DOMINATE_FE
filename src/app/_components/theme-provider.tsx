// ./_components/theme-provider.tsx
'use client'

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider defaultTheme='system' attribute='class' enableSystem disableTransitionOnChange {...props}>
      {children}
    </NextThemesProvider>
  )
}
