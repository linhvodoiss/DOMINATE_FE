'use client'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function Payment() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [orderCode, setOrderCode] = useState('')
  const [checkoutUrl, setCheckoutUrl] = useState('')
  const [qrCode, setQrCode] = useState('')

  const handlePayment = async () => {
    const response = await fetch('http://localhost:8081/api/v1/payment/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderCode, amount, description }),
    })
    const { data } = await response.json()
    setCheckoutUrl(checkoutUrl)
    setQrCode(data.qrCode)
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-4 text-2xl font-bold'>Thanh Toán</h1>
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Mã đơn hàng'
          value={orderCode}
          onChange={e => setOrderCode(e.target.value)}
          className='mr-2 border p-2'
        />
        <input
          type='number'
          placeholder='Số tiền (VND)'
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className='mr-2 border p-2'
        />
        <input
          type='text'
          placeholder='Mô tả'
          value={description}
          onChange={e => setDescription(e.target.value)}
          className='mr-2 border p-2'
        />
        <button onClick={handlePayment} className='rounded bg-blue-500 p-2 text-white'>
          Tạo Thanh Toán
        </button>
      </div>
      {qrCode && (
        <div className='mt-4'>
          <h2 className='text-xl'>Quét mã QR để thanh toán</h2>
          <QRCodeSVG value={qrCode} size={256} />
          <p className='mt-2'>
            Hoặc{' '}
            <a href={checkoutUrl} className='text-blue-500'>
              nhấn vào đây
            </a>{' '}
            để thanh toán.
          </p>
        </div>
      )}
    </div>
  )
}
