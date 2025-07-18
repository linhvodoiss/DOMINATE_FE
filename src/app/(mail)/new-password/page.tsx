'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { CODE_SUCCESS } from '~/constants'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { ResetPasswordStyled } from './styled'
import { ResetFormValues, ResetSchema } from '#/zodType'

export default function ResetPasswordForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      password: '',
      rePassword: '',
    },
  })
  async function onSubmit(data: ResetFormValues) {
    startTransition(async () => {
      const res = await http.get(LINKS.reset_password, {
        params: {
          newPassword: data.password,
          token,
        },
        baseUrl: '/api',
      })
      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      router.push('/')
      router.refresh()
    })
  }

  return (
    <ResetPasswordStyled>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='border-primary-system bg-primary-foreground mx-auto mt-12 w-full rounded-2xl border-2 px-8 pt-8 pb-12 shadow-2xl md:w-[600px]'
          autoComplete='off'
        >
          <h2 className='text-primary pb-4 text-center text-3xl font-semibold'>Reset password</h2>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Password'
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
          <div>
            <button
              className='hover:bg-primary-hover bg-primary-system mx-auto mt-4 block w-full cursor-pointer items-center justify-center rounded-2xl px-12 py-4 text-white'
              disabled={isPending}
            >
              Reset
            </button>
          </div>
        </form>
      </Form>
    </ResetPasswordStyled>
  )
}
