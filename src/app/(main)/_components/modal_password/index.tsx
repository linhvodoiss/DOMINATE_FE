import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import z from 'zod'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
import { toast } from 'sonner'
import { CODE_SUCCESS } from '~/constants'
import { ChangeSchema } from '#/zodType'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitOrder?: () => void
}

export default function ModalPassword({ open, onOpenChange }: DialogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ChangeSchema>>({
    resolver: zodResolver(ChangeSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      rePassword: '',
    },
  })
  async function onSubmit(data: z.infer<typeof ChangeSchema>) {
    startTransition(async () => {
      const res = await http.patch(LINKS.change_password, {
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
        baseUrl: '/api',
      })
      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      onOpenChange(false)
      router.refresh()
    })
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-primary-foreground'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Change Password</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='form border-primary-system mx-auto w-full rounded-2xl border-2 px-8 pt-8 pb-12 shadow-2xl'
            autoComplete='off'
            noValidate
          >
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Old password'
                      className='mt-4 w-full rounded-xl border-2 px-4 py-6 !text-base'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='data-[error=true]:text-destructive' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='New password'
                      className='mt-4 w-full rounded-xl border-2 px-4 py-6 !text-base'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='data-[error=true]:text-destructive' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='rePassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Confirm password'
                      className='mt-4 w-full rounded-xl border-2 px-4 py-6 !text-base'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='data-[error=true]:text-destructive' />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={() => form.handleSubmit(onSubmit)()} disabled={isPending}>
            Change
          </Button>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
