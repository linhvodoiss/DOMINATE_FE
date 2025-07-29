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
import { LoginStyled } from './styled'
import { LoginResponse } from '#/user'
import { LoginFormValues, LoginSchema } from '#/zodType'

export default function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
  })
  async function onSubmit(data: LoginFormValues) {
    startTransition(async () => {
      const res = await http.post<LoginResponse>(LINKS.login_api, { body: JSON.stringify(data), baseUrl: 'api/auth' })
      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      if (res.user?.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/')
      }
      router.refresh()
    })
  }

  return (
    <LoginStyled>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='border-primary-system bg-primary-foreground mx-auto mt-12 w-full rounded-2xl border-2 px-4 pt-8 pb-12 shadow-md md:w-[600px] md:px-8'
          autoComplete='off'
        >
          <h2 className='text-primary pb-4 text-center text-3xl font-semibold'>Login</h2>
          <FormField
            control={form.control}
            name='userName'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Username'
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
          <div>
            <div className='text-primary text-end'>
              <Link href='/forget' className='mt-2 mb-2 block w-full !text-end text-sm font-semibold'>
                Forget password?
              </Link>
            </div>
            <div className='flex w-full items-center justify-between gap-4 text-base font-semibold text-white'>
              <button
                className='bg-primary-system hover:bg-primary-hover w-full cursor-pointer items-center justify-center rounded-2xl py-4'
                type='submit'
                disabled={isPending}
              >
                LOGIN
              </button>
              <Link
                href='/register'
                className='text-primary border-primary-system hover:bg-primary-foreground-hover flex w-full cursor-pointer items-center justify-center rounded-2xl border-2 py-4'
              >
                REGISTER
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </LoginStyled>
  )
}
