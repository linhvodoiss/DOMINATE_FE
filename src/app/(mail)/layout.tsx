import HeaderMail from '../_components/headerMail'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <HeaderMail />
      <div className='mx-auto max-w-[1536px]'>{children}</div>
    </>
  )
}
