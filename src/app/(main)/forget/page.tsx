'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { CODE_SUCCESS } from '~/constants'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import Link from 'next/link'
import { ForgetStyled } from './styled'
import { ForgetFormValues, ForgetSchema } from '#/zodType'

export default function ForgetForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<ForgetFormValues>({
    resolver: zodResolver(ForgetSchema),
    defaultValues: {
      email: '',
    },
  })
  async function onSubmit(data: ForgetFormValues) {
    startTransition(async () => {
      const [checkEmailRes] = await Promise.all([
        http.get<{ check: boolean }>(LINKS.check_email_exist, {
          params: { email: data.email },
          baseUrl: '/api',
        }),
      ])

      if (!checkEmailRes.check) {
        toast.error('Email not found!')
        return
      }
      const res = await http.get(LINKS.forget_pass, {
        params: { email: data.email },
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
    <ForgetStyled>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='border-primary-system bg-primary-foreground mx-auto mt-12 w-full rounded-2xl border-2 px-4 pt-8 pb-12 shadow-md md:w-[600px] md:px-8'
          autoComplete='off'
          noValidate
        >
          <h2 className='text-primary pb-4 text-center text-3xl font-semibold'>Forget password</h2>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Your email'
                    className='mt-4 w-full rounded-xl border-2 px-4 py-8 !text-base'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='data-[error=true]:text-destructive' />
              </FormItem>
            )}
          />
          <button
            className='bg-primary-system hover:bg-primary-hover mx-auto mt-4 block w-1/2 cursor-pointer items-center justify-center rounded-2xl px-12 py-4 font-semibold text-white'
            disabled={isPending}
          >
            Send email
          </button>
          <p className='text-md mt-4 text-center'>
            Comeback login?{' '}
            <Link href='/login' className='text-primary font-semibold'>
              Login
            </Link>
          </p>
        </form>
      </Form>
    </ForgetStyled>
  )
}
