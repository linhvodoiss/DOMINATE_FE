import type { Metadata } from 'next'
import './globals.css'
import { cn } from '~/utils/cn'
import { Toaster } from '~/components/ui/sonner'
import { eremitageFont } from '~/fonts/eremitage'
import { LoadingFallback } from './_components/page-content'
import { Suspense } from 'react'
import { ThemeProvider } from './_components/theme-provider'
import ScrollToTop from './_components/scroll-to-top'

export const metadata: Metadata = {
  title: 'Automate',
  description: 'Automate For Solution',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='light' style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <body className={cn('antialiased', eremitageFont.variable)} suppressHydrationWarning>
        <div className=''>
          <Suspense fallback={<LoadingFallback />}>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </Suspense>
        </div>
        <ScrollToTop />
        <Toaster richColors theme='light' />
      </body>
    </html>
  )
}
