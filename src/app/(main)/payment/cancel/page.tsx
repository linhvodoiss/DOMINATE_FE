import { CircleX } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function CancelPage() {
  return (
    <div className='bg-primary-foreground fixed inset-0 z-[999] flex flex-col items-center justify-center px-4 text-center'>
      <CircleX className='mb-4 h-10 w-10 text-red-600' />
      <Link href='/' className='mt-6 rounded bg-red-600 px-6 py-2 font-medium text-white transition hover:bg-red-700'>
        Back to Homepage
      </Link>
    </div>
  )
}
