import { FormField, FormItem, FormControl, FormMessage, Form } from '~/components/ui/form'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { UseFormReturn } from 'react-hook-form'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitOrder: () => void
  pending?: boolean
  title?: string
  content?: string
  isReminder?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: UseFormReturn<any>
}

export default function ModalTypeActivated({
  open,
  onOpenChange,
  onSubmitOrder,
  pending,
  title = 'CHOOSE TYPE LICENSE TO ACTIVATED',
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
        <Select>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Choose type to active' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='DEV'>Dev</SelectItem>
            <SelectItem value='RUNTIME'>Runtime</SelectItem>
          </SelectContent>
        </Select>
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
