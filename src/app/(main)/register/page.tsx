'use client'
import { z } from 'zod'
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
import { RegisterStyled } from './styled'
import Link from 'next/link'
import { RegisterSchema } from '#/zodType'

export default function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      phoneNumber: '',
    },
  })
  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    startTransition(async () => {
      const [checkEmailRes, checkUserNameRes, checkPhoneNumberRes] = await Promise.all([
        http.get<{ check: boolean }>(LINKS.check_email_exist, {
          params: { email: data.email },
          baseUrl: '/api',
        }),
        http.get<{ check: boolean }>(LINKS.check_username_exist, {
          params: { userName: data.userName },
          baseUrl: '/api',
        }),
        http.get<{ check: boolean }>(LINKS.check_phone_number__exist, {
          params: { phoneNumber: data.phoneNumber },
          baseUrl: '/api',
        }),
      ])

      if (checkEmailRes.check || checkUserNameRes.check || checkPhoneNumberRes.check) {
        if (checkEmailRes.check) toast.error('Email đã tồn tại')
        if (checkUserNameRes.check) toast.error('Tài khoản đã tồn tại')
        if (checkPhoneNumberRes.check) toast.error('Số điện thoại đã tồn tại')
        return
      }

      const res = await http.post(LINKS.register_api, {
        body: JSON.stringify(data),
        baseUrl: '/api',
      })

      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error('Đăng ký thất bại')
        return
      }

      toast.success('Đăng ký thành công')
      router.push('/login')
      router.refresh()
    })
  }

  return (
    <RegisterStyled>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='form border-primary-system bg-primary-foreground mx-auto mt-12 w-[600px] rounded-2xl border-2 px-8 pt-8 pb-12 shadow-md'
          autoComplete='off'
          noValidate
        >
          <h2 className='text-primary pb-4 text-center text-3xl font-semibold'>Đăng ký</h2>
          <FormField
            control={form.control}
            name='userName'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Tên tài khoản'
                    className='mt-4 w-full rounded-xl border-2 px-4 py-6 !text-base'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='data-[error=true]:text-destructive' />
              </FormItem>
            )}
          />
          <div className='mt-4 flex w-full items-start justify-between gap-4'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      placeholder='Họ của bạn'
                      className='w-full rounded-xl border-2 px-4 py-6 !text-base'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='data-[error=true]:text-destructive' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      placeholder='Tên của bạn'
                      className='w-full rounded-xl border-2 px-4 py-6 !text-base'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='data-[error=true]:text-destructive' />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Email của bạn'
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
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Số điện thoại'
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
                    placeholder='Mật khẩu'
                    className='mt-4 w-full rounded-xl border-2 px-4 py-6 !text-base'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='data-[error=true]:text-destructive' />
              </FormItem>
            )}
          />
          <button
            className='hover:bg-primary-hover bg-primary-system mx-auto mt-4 block w-full cursor-pointer items-center justify-center rounded-2xl px-12 py-4 font-semibold text-white'
            disabled={isPending}
          >
            TIẾP TỤC
          </button>
          <p className='text-md mt-4 text-center'>
            Bạn có tài khoản?
            <Link href='/login' className='text-primary font-semibold'>
              Đăng nhập
            </Link>
          </p>
        </form>
      </Form>
    </RegisterStyled>
  )
}
