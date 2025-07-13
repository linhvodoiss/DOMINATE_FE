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
  pending: boolean
}
export default function ModalOrder({ open, onOpenChange, onSubmitOrder, pending }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={e => pending && e.preventDefault()}
        onEscapeKeyDown={e => pending && e.preventDefault()}
        className='bg-primary-foreground'
      >
        <DialogHeader>
          <DialogTitle className='text-xl'>PAY CONFIRM</DialogTitle>
        </DialogHeader>
        <div className='py-4'>Are you sure to confirm paid?</div>
        <DialogFooter>
          <Button onClick={onSubmitOrder} disabled={pending}>
            OK
          </Button>
          <DialogClose asChild>
            <Button variant='outline' disabled={pending}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
