'use client'
import { useState } from 'react'

import { Lock } from 'lucide-react'
import ModalPassword from '../modal_password'

export default function LockBtn() {
  const [open, setOpen] = useState(false)

  function onOpenChange(open: boolean) {
    setOpen(open)
  }

  return (
    <>
      <button
        className='hover:bg-primary-mute relative w-full cursor-pointer border-b border-white/20 px-4 pt-4 pb-2 text-start'
        onClick={() => onOpenChange(true)}
      >
        Change Password <Lock className='absolute top-1/2 right-16 -translate-y-1/2' />
      </button>
      <ModalPassword open={open} onOpenChange={onOpenChange} />
    </>
  )
}
