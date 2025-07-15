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
import Link from 'next/link'
import { ForgetStyled } from './styled'
import { ForgetSchema } from '#/zodType'

export default function ForgetForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ForgetSchema>>({
    resolver: zodResolver(ForgetSchema),
    defaultValues: {
      email: '',
    },
  })
  async function onSubmit(data: z.infer<typeof ForgetSchema>) {
    startTransition(async () => {
      const [checkEmailRes] = await Promise.all([
        http.get<{ check: boolean }>(LINKS.check_email_exist, {
          params: { email: data.email },
          baseUrl: '/api',
        }),
      ])

      if (!checkEmailRes.check) {
        toast.error('Không tìm thấy email')
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
          className='form border-primary-system bg-primary-foreground mx-auto mt-12 w-[600px] rounded-2xl border-2 px-8 pt-8 pb-12 shadow-md'
          autoComplete='off'
          noValidate
        >
          <h2 className='text-primary pb-4 text-center text-3xl font-semibold'>Quên mật khẩu</h2>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Email của bạn'
                    className='mt-4 w-full rounded-xl border-2 px-4 py-8 !text-base'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='data-[error=true]:text-destructive' />
              </FormItem>
            )}
          />
          <button
            className='bg-primary-system hover:bg-primary-hover mx-auto mt-4 block w-full cursor-pointer items-center justify-center rounded-2xl px-12 py-4 font-semibold text-white'
            disabled={isPending}
          >
            Quên mật khẩu
          </button>
          <p className='text-md mt-4 text-center'>
            Quay lại đăng nhập?
            <Link href='/login' className='text-primary font-semibold'>
              Đăng nhập
            </Link>
          </p>
        </form>
      </Form>
    </ForgetStyled>
  )
}
