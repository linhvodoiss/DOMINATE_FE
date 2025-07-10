export function LoadingFallback() {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center !bg-black'>
      <div className='mt-4 font-bold text-white'>Đang tải...</div>
    </div>
  )
}
