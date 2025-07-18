'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { CODE_SUCCESS } from '~/constants'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { ProfileStyled } from './styled'
import { User } from '#/user'
import { useEffect } from 'react'
import { ProfileFormValues, ProfileSchema } from '#/zodType'

export default function ProfilePage({ user }: { user: User }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [update, setUpdate] = useState(true)
  const mockData = {
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
  }
  const [data] = useState(mockData)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
    },
  })
  async function onSubmit(data: ProfileFormValues) {
    startTransition(async () => {
      const [checkPhoneNumberRes] = await Promise.all([
        http.get<{ check: boolean }>(LINKS.check_phone_number__exist, {
          params: { phoneNumber: data.phoneNumber },
        }),
      ])

      if (checkPhoneNumberRes.check) {
        if (checkPhoneNumberRes.check) toast.error('Phone number have already exist')
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, userName, ...rest } = data
      const res = await http.put(LINKS.profile, {
        body: JSON.stringify(rest),
        baseUrl: '/api',
      })
      console.log(res)

      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error('Update information failed')
        return
      }

      toast.success(res.message)
      router.push('/login')
      router.refresh()
    })
  }

  const updateProfileHandler = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    setUpdate(!update)
  }

  useEffect(() => {
    if (update) {
      form.reset(data)
    }
  }, [data, form, update])
  return (
    <ProfileStyled className='bg-primary-foreground mt-12 grid grid-cols-12 items-center gap-4 rounded-2xl border-[1px] px-32 pt-8 pb-12 shadow-md'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='form border-primary-system col-span-9'
          autoComplete='off'
          noValidate
        >
          <h2 className='text-primary text-start text-3xl font-semibold'>Profile Information</h2>
          <hr className='mt-3 mb-6' />
          <FormField
            control={form.control}
            name='userName'
            render={({ field }) => (
              <FormItem>
                <div className='grid grid-cols-12 gap-4'>
                  <FormLabel className='col-span-2 justify-self-end font-semibold'>Username</FormLabel>
                  <FormControl>
                    <Input
                      classNameWrap='col-span-10 w-full'
                      disabled={!update}
                      readOnly={update}
                      placeholder='Tên tài khoản'
                      className='w-full rounded-xl border-2 px-4 py-6 !text-base'
                      {...field}
                    />
                  </FormControl>
                </div>
                <div className='grid grid-cols-12 gap-4'>
                  <FormMessage className='data-[error=true]:text-destructive col-span-10 col-start-3' />
                </div>
              </FormItem>
            )}
          />
          <div className='mt-4 grid grid-cols-12 items-start gap-4'>
            <p className='col-span-2 justify-self-end pt-[14%] text-sm font-semibold'>Your name</p>
            <div className='col-span-10 flex w-full items-start justify-between gap-8'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='w-full gap-0'>
                    <FormControl>
                      <Input
                        readOnly={update}
                        placeholder='Your first name'
                        className='w-full rounded-xl border-2 px-4 py-6 !text-base'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='data-[error=true]:text-destructive font-semibold' hint='First' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='w-full gap-0'>
                    <FormControl>
                      <Input
                        readOnly={update}
                        placeholder='Your last name'
                        className='w-full rounded-xl border-2 px-4 py-6 !text-base'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='data-[error=true]:text-destructive font-semibold' hint='Last' />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <div className='mt-4 grid grid-cols-12 gap-4'>
                  <FormLabel className='col-span-2 justify-self-end font-semibold'>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!update}
                      readOnly={update}
                      type='email'
                      placeholder='Your mail'
                      classNameWrap='col-span-10 w-full'
                      className='w-full rounded-xl border-2 px-4 py-6 !text-base'
                      {...field}
                    />
                  </FormControl>
                </div>
                <div className='grid grid-cols-12 gap-4'>
                  <FormMessage className='data-[error=true]:text-destructive col-span-10 col-start-3' />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <div className='mt-4 grid grid-cols-12 gap-4'>
                  <FormLabel className='col-span-2 justify-self-end font-semibold'>Phone number</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={update}
                      type='number'
                      placeholder='Phone number'
                      classNameWrap='col-span-10 w-full'
                      className='w-full rounded-xl border-2 px-4 py-6 !text-base'
                      {...field}
                    />
                  </FormControl>
                </div>
                <div className='grid grid-cols-12 gap-4'>
                  <FormMessage className='data-[error=true]:text-destructive col-span-10 col-start-3' />
                </div>
              </FormItem>
            )}
          />
          <div className='mt-4 grid grid-cols-12'>
            {update ? (
              <div className='col-span-10 col-start-3'>
                <button
                  type='button'
                  className='hover-header-button bg-primary-system inline-block w-40 cursor-pointer items-center justify-center rounded-2xl py-4 font-semibold text-white'
                  onClick={e => updateProfileHandler(e)}
                >
                  Change Info
                </button>
              </div>
            ) : (
              <div className='col-span-10 col-start-3 font-semibold'>
                <button
                  type='button'
                  className='hover-header-button bg-primary-system mr-4 inline-block w-40 cursor-pointer items-center justify-center rounded-2xl py-4 text-white'
                  onClick={e => updateProfileHandler(e)}
                >
                  Cancel Change
                </button>
                <button
                  disabled={isPending}
                  type='submit'
                  className='hover-header-button bg-primary-system inline-block w-40 cursor-pointer items-center justify-center rounded-2xl py-4 text-white'
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </form>
      </Form>
      <div className='col-span-3 col-start-11'>
        <div className='bg-background-primary ring-primary-system relative aspect-square w-full rounded-full ring-2'>
          <span className='absolute -bottom-10 left-1/2 -translate-x-1/2 text-nowrap'>Choose image</span>
        </div>
      </div>
    </ProfileStyled>
  )
}
