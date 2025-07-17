'use client'
import { useState } from 'react'

import { Lock } from 'lucide-react'
import ModalPassword from './modal_password'

export default function LockBtn() {
  const [open, setOpen] = useState(false)

  function onOpenChange(open: boolean) {
    setOpen(open)
  }

  return (
    <>
      <button
        className='border-primary-system text-primary hover:bg-primary-mute relative w-full cursor-pointer py-2'
        onClick={() => onOpenChange(true)}
      >
        Change Password <Lock className='absolute top-1/2 right-[32px] -translate-y-1/2' />
      </button>
      <ModalPassword open={open} onOpenChange={onOpenChange} />
    </>
  )
}
