'use client'
import { QRCodeSVG } from 'qrcode.react'
import CopyableText from '~/app/_components/copy-text'

interface Props {
  amount: number
}

export default function BankTransferPayment({ amount }: Props) {
  return (
    <div className='mt-10 rounded-xl border p-4 shadow md:p-6'>
      <div className='mb-4 flex items-center gap-4'>
        <h2 className='text-primary text-center text-lg font-bold md:text-left md:text-xl'>VietinBank</h2>
        <button className='bg-primary-system hover:bg-primary-hover cursor-pointer rounded-md px-6 py-2 font-semibold text-white'>
          Have paid
        </button>
      </div>
      <div className='mb-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:text-base'>
        <CopyableText label='Account name' value='NGUYEN THI HUONG' />
        <CopyableText label='Account number' value='0386331971' />
        <CopyableText label='Description' value='DOMINATE' />
        <CopyableText label='Money' value={`${amount.toLocaleString('vi-VN')} đ`} />
      </div>
      <p className='text-destructive my-4 text-center text-sm font-medium'>
        * Note: Please make sure to enter the <span className='font-semibold'>correct payment description</span> and{' '}
        <span className='font-semibold'>exact amount</span>.
      </p>
      <div className='flex flex-col items-center'>
        <QRCodeSVG
          value='00020101021138540010A00000072701240006970415011003863319710208QRIBFTTA53037045802VN63046733'
          size={192}
        />
        <p className='text-muted-foreground mt-2 text-sm'>Scan QR for pay</p>
      </div>
    </div>
  )
}
