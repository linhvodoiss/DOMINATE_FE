import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { UseFormReturn } from 'react-hook-form'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unbindHandler: () => void
  pending: boolean
  title?: string
  content?: string
  isReminder?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: UseFormReturn<any>
}

export default function ModalBind({
  open,
  onOpenChange,
  unbindHandler,
  pending,
  title = 'UNBIND CONFIRM',
  content = 'Are you sure want to unbind this license.',
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
        <div className='py-2'>{content}</div>
        <DialogFooter>
          <Button onClick={unbindHandler} disabled={pending}>
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
