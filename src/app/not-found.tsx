import Link from 'next/link'

export default function _404Page() {
  return (
    <>
      <h2 className='text-3xl'>Không tìm thấy trang.</h2>
      <p className='mt-2 text-center'>
        Vui lòng nhấn vào nút &quot;
        <span className='font-bold text-orange-500'>Trang chủ</span>&quot; bên dưới để quay lại trang chính.
      </p>
      <Link href='/' className='mt-4 cursor-pointer rounded-lg border px-4 py-2 text-base'>
        Trang chủ
      </Link>
    </>
  )
}
export const metadata = {
  title: '404 - Page Not Found',
  description: 'Page you finding is not found.',
}
