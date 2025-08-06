import { FormField, FormItem, FormControl, FormMessage, Form } from '~/components/ui/form'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { UseFormReturn } from 'react-hook-form'
import { Textarea } from '~/components/ui/textarea'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitOrder: () => void
  pending: boolean
  title?: string
  content?: string
  isReminder?: boolean
  isCancel?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: UseFormReturn<any>
}

export default function ModalOrder({
  open,
  onOpenChange,
  onSubmitOrder,
  pending,
  isReminder,
  isCancel,
  title = 'PAY CONFIRM',
  content = 'Please enter a message to remind admin.',
  form,
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

        {isReminder && form && (
          <Form {...form}>
            <FormField
              control={form.control}
              name='reminder'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder='Content reminder admin...' disabled={pending} {...field} />
                  </FormControl>
                  <FormMessage className='data-[error=true]:text-destructive' />
                </FormItem>
              )}
            />
          </Form>
        )}
        {isCancel && form && (
          <Form {...form}>
            <FormField
              control={form.control}
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder='Reason cancel...' disabled={pending} {...field} />
                  </FormControl>
                  <FormMessage className='data-[error=true]:text-destructive' />
                </FormItem>
              )}
            />
          </Form>
        )}

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
