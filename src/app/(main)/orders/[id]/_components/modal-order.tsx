import { Button } from '~/components/ui/button'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '~/components/ui/dialog'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitOrder?: () => void
}
export default function ModalOrder({ open, onOpenChange, onSubmitOrder }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-primary-foreground'>
        <DialogHeader>
          <DialogTitle className='text-xl'>PAY CONFIRM</DialogTitle>
        </DialogHeader>
        <div className='py-4'>Are you sure to confirm paid?</div>
        <DialogFooter>
          <Button onClick={onSubmitOrder}>OK</Button>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
