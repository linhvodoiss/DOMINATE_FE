import { Button } from '~/components/ui/button'

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitOrder?: () => void
  pending: boolean
  title?: string
  content?: string
}

export default function ModalOrder({
  open,
  onOpenChange,
  onSubmitOrder,
  pending,
  title = 'PAY CONFIRM',
  content = 'Are you sure to confirm paid?',
}: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={e => pending && e.preventDefault()}
        onEscapeKeyDown={e => pending && e.preventDefault()}
        className='bg-primary-foreground'
      >
        <DialogHeader>
          <DialogTitle className='text-xl'>{title}</DialogTitle>
        </DialogHeader>
        <div className='py-4'>{content}</div>
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
