import { User } from '#/user'
import { Descriptions } from 'antd'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { AUTH } from '~/constants'
import { LINKS } from '~/constants/links'
import http from '~/utils/http'
export default async function ProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH.token)?.value
  let data: User | undefined = undefined

  if (token) {
    const res = await http.get<User>(`${LINKS.profile}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    data = res.data
  }
  return (
    <div className='min-h-[500px] w-full rounded p-6 shadow md:w-[700px]'>
      <h2 className='!mb-4 !text-2xl !font-bold'>Profile Information</h2>
      <Descriptions bordered size='middle' column={1}>
        <Descriptions.Item label='Username'>{data?.userName}</Descriptions.Item>
        <Descriptions.Item label='Full Name'>{`${data?.firstName}  ${data?.lastName}`}</Descriptions.Item>
        <Descriptions.Item label='Email'>{data?.email}</Descriptions.Item>
        <Descriptions.Item label='Phone Number'>{data?.phoneNumber}</Descriptions.Item>
      </Descriptions>
      <Link
        href='/admin'
        className='!bg-primary-system !border-primary-system !mt-4 !inline-block rounded-md px-6 py-2 !text-white'
      >
        Back
      </Link>
    </div>
  )
}
