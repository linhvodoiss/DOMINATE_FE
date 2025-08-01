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

import AvatarUpload from '../avatar-upload'

export default function ProfilePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [update, setUpdate] = useState(true)
  const [initialPhone, setInitialPhone] = useState<User | string>('')
  const [initialData, setInitialData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    },
  })

  // Fetch profile data from API
  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true)
        const res = await http.get<User>(LINKS.profile, {
          baseUrl: '/api',
        })
        if (res) {
          form.reset(res.data)
          setInitialData(res.data as User)
          setInitialPhone(res?.data?.phoneNumber ?? (0 as User))
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error('Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [form])

  async function onSubmit(data: ProfileFormValues) {
    startTransition(async () => {
      const isPhoneChanged = data.phoneNumber !== initialPhone

      if (isPhoneChanged) {
        const checkRes = await http.get<{ check: boolean }>(LINKS.check_phone_number__exist, {
          params: { phoneNumber: data.phoneNumber },
        })

        if (checkRes.check) {
          toast.error('Phone number already exists')
          return
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, userName, ...rest } = data
      const res = await http.put(LINKS.profile, {
        body: JSON.stringify(rest),
        baseUrl: '/api',
      })

      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error('Update information failed')
        return
      }
      setUpdate(!update)
      toast.success(res.message)
      router.refresh()
    })
  }

  const updateProfileHandler = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()

    if (!update && initialData) {
      form.reset(initialData)
    }
    setUpdate(!update)
  }

  return (
    <ProfileStyled className='bg-primary-foreground mt-12 rounded-2xl border-[1px] px-6 pt-8 pb-12 shadow-md md:px-12 xl:px-32'>
      {/* Choose Image block - mobile lên trên, desktop nằm phải */}
      <h2 className='text-primary text-start text-3xl font-semibold'>Profile Information</h2>
      <hr className='mt-3 mb-6' />
      <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
        <div className='order-1 flex justify-center md:order-2 md:col-span-3 md:col-start-11'>
          <AvatarUpload avatarUrl={initialData?.avatarUrl} isLoading={isLoading} />
        </div>

        {/* Form block */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='form border-primary-system order-2 md:order-1 md:col-span-9'
            autoComplete='off'
            noValidate
          >
            {/* Username */}
            <FormField
              control={form.control}
              name='userName'
              render={({ field }) => (
                <FormItem>
                  <div className='grid grid-cols-12 gap-4'>
                    <FormLabel className='col-span-12 justify-self-start font-semibold text-nowrap md:col-span-2 md:justify-self-end'>
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        classNameWrap='md:col-span-10 col-span-12 w-full'
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

            {/* First & Last name */}
            <div className='mt-4 grid grid-cols-12 items-start gap-4'>
              <p className='col-span-12 justify-self-start pt-0 text-sm font-semibold text-nowrap md:col-span-2 md:justify-self-end md:pt-[14%]'>
                Your name
              </p>
              <div className='col-span-12 flex w-full items-start justify-between gap-4 md:col-span-10 md:gap-8'>
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

            {/* Email */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <div className='mt-4 grid grid-cols-12 gap-4'>
                    <FormLabel className='col-span-12 justify-self-start font-semibold text-nowrap md:col-span-2 md:justify-self-end'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={!update}
                        readOnly={update}
                        type='email'
                        placeholder='Your mail'
                        classNameWrap='md:col-span-10 col-span-12 w-full'
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

            {/* Phone Number */}
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <div className='mt-4 grid grid-cols-12 gap-4'>
                    <FormLabel className='col-span-12 justify-self-start font-semibold text-nowrap md:col-span-2 md:justify-self-end'>
                      Phone number
                    </FormLabel>
                    <FormControl>
                      <Input
                        readOnly={update}
                        type='number'
                        placeholder='Phone number'
                        classNameWrap='md:col-span-10 col-span-12 w-full'
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

            {/* Buttons */}
            <div className='mt-4 grid grid-cols-12'>
              {update ? (
                <div className='col-span-10 col-start-1 md:col-start-3'>
                  <button
                    disabled={isLoading}
                    type='button'
                    className='hover-header-button bg-primary-system inline-block w-40 cursor-pointer items-center justify-center rounded-2xl py-4 font-semibold text-white'
                    onClick={e => updateProfileHandler(e)}
                  >
                    Change Info
                  </button>
                </div>
              ) : (
                <div className='col-span-10 col-start-1 flex font-semibold md:col-start-3 md:block'>
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
      </div>
    </ProfileStyled>
  )
}
