'use client'
import { Button, Descriptions, Tag, Divider, Radio } from 'antd'
import React, { useState, useTransition } from 'react'
import { paymentMethodMap, paymentStatusMap, statusColorMap } from '~/constants/payment-type'
import { OrderResponse } from '#/order'
import { billingCycleMap, typePackageMap } from '~/constants/package-type'
import { BIN_BANK_MAP } from '~/constants/bank-list'
import { useRouter } from 'next/navigation'
import { CODE_SUCCESS } from '~/constants'
import { toast } from 'sonner'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { LicenseResponse } from '#/licenses'

const colResponsive = { xs: 1, sm: 1, md: 1, lg: 1 }
export default function AdminOrderPreview({ data, id }: { data: OrderResponse; id: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [status, setStatus] = useState(data.paymentStatus)
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false)
  const handleUpdateStatus = () => {
    startTransition(async () => {
      const res = await http.patch(`${LINKS.order}/${data.orderId}`, {
        params: {
          newStatus: status,
        },
        baseUrl: '/api',
      })

      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message || 'Update status failed')
        return
      }

      toast.success(res.message || 'Status updated successfully')

      // Check status success, take key
      if (status === 'SUCCESS') {
        try {
          const licenseRes = await http.post<LicenseResponse>(LINKS.licenses_create, {
            body: JSON.stringify({
              orderId: Number(id),
            }),
            baseUrl: '/api',
          })

          if (CODE_SUCCESS.includes(licenseRes.code)) {
            toast.success('License created successfully')
          } else {
            toast.error(licenseRes.message || 'Create license failed')
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          toast.error('Error while creating license')
        }
      }

      router.refresh()
    })
  }

  return (
    <div className='mx-auto max-w-7xl p-6'>
      <h2 className='!mb-4 !text-2xl !font-bold'>
        # Order Code {id} - {paymentMethodMap[data.paymentMethod as string] || data.paymentMethod}
      </h2>

      <Radio.Group optionType='button' buttonStyle='solid' value={status} onChange={e => setStatus(e.target.value)}>
        {Object.entries(paymentStatusMap).map(([key, label]) => (
          <Radio.Button
            key={key}
            value={key}
            style={{
              color: '#fff',
              backgroundColor: statusColorMap[key],
              transition: 'all 0.3s',
            }}
            className='custom-radio-button'
          >
            {label}
          </Radio.Button>
        ))}
      </Radio.Group>
      <Button
        type='primary'
        loading={isPending}
        onClick={handleUpdateStatus}
        className='!bg-primary-system !border-primary-system mt-4 !block'
      >
        Update
      </Button>

      <div className='grid grid-cols-1 gap-6'>
        {/* Order Info */}
        <div>
          <Divider orientation='left'>Order Information</Divider>
          <Descriptions bordered size='middle' column={colResponsive}>
            <Descriptions.Item label='Order ID'>{id}</Descriptions.Item>
            <Descriptions.Item label='Payment Status'>
              <Tag color={statusColorMap[data.paymentStatus as string]}>
                {paymentStatusMap[data.paymentStatus as string]}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Payment Method'>
              {paymentMethodMap[data.paymentMethod as string] || data.paymentMethod}
            </Descriptions.Item>
            <Descriptions.Item label='Total Price'>{data.price?.toLocaleString()}₫</Descriptions.Item>
            <Descriptions.Item label='Created At'>{data.createdAt}</Descriptions.Item>
          </Descriptions>
        </div>

        {/* Subscription Info */}
        <div>
          <Divider orientation='left'>Package</Divider>
          {data.subscription ? (
            <Descriptions bordered size='middle' column={colResponsive}>
              <Descriptions.Item label='Package Name'>{data.subscription.name}</Descriptions.Item>
              <Descriptions.Item label='Original Price'>{data.subscription.price?.toLocaleString()}₫</Descriptions.Item>
              <Descriptions.Item label='Discount'>{data.subscription.discount}%</Descriptions.Item>
              <Descriptions.Item label='Billing Cycle'>
                {billingCycleMap[data.subscription.billingCycle as string] || data.subscription.billingCycle}
              </Descriptions.Item>
              <Descriptions.Item label='Package Type'>
                {typePackageMap[data.subscription.typePackage as string] || data.subscription.typePackage}
              </Descriptions.Item>
              <Descriptions.Item label='Is Active'>{data.subscription.isActive ? 'Yes' : 'No'}</Descriptions.Item>

              <Descriptions.Item label='Options' span={2}>
                <ul className='list-disc pl-4'>
                  {(showMoreOptions ? data.subscription?.options : data.subscription?.options?.slice(0, 4))?.map(
                    opt => <li key={opt.id}>{opt.name}</li>
                  )}
                </ul>

                {data.subscription?.options && data.subscription.options.length > 4 && (
                  <Button
                    type='link'
                    size='small'
                    onClick={() => setShowMoreOptions(prev => !prev)}
                    className='mt-1 p-0'
                  >
                    {showMoreOptions ? 'Ẩn bớt' : 'Xem thêm'}
                  </Button>
                )}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <p>No subscription data available.</p>
          )}
        </div>
        <div>
          <Divider orientation='left'>Customer</Divider>
          {data.buyer ? (
            <Descriptions bordered size='middle' column={colResponsive}>
              <Descriptions.Item label='User Name'>{data.buyer?.userName}</Descriptions.Item>
              <Descriptions.Item label='Full Name'>
                {data.buyer?.firstName} {data.buyer?.lastName}
              </Descriptions.Item>
              <Descriptions.Item label='Email'>{data.buyer?.email}</Descriptions.Item>
              <Descriptions.Item label='Phone Number'>{data.buyer?.phoneNumber}</Descriptions.Item>
              {data.paymentMethod !== 'BANK' && (
                <>
                  <Descriptions.Item label='Bank'>{BIN_BANK_MAP[data.bin as string]}</Descriptions.Item>
                  <Descriptions.Item label='Account Number'>{data.accountNumber}</Descriptions.Item>
                  <Descriptions.Item label='Account Name'>{data.accountName}</Descriptions.Item>
                </>
              )}
            </Descriptions>
          ) : (
            <p>No user data available.</p>
          )}
        </div>
        <div>
          <Divider orientation='left'>License</Divider>
          {data.license ? (
            <Descriptions bordered size='middle' column={colResponsive}>
              <Descriptions.Item label='Key'>{data.license?.licenseKey}</Descriptions.Item>
              <Descriptions.Item label='Day Lefts'>{data.license?.daysLeft}</Descriptions.Item>
              <Descriptions.Item label='Used?'>{data.license?.canUsed ? 'Yes' : 'No'}</Descriptions.Item>

              {data.license.activatedAt && (
                <Descriptions.Item label='Actived At'>{data.license?.activatedAt}</Descriptions.Item>
              )}
              {data.license.canUsed && (
                <Descriptions.Item label='Hardware Id'>
                  {data.license.hardwareId || 'No connect device'}
                </Descriptions.Item>
              )}
            </Descriptions>
          ) : (
            <p>No key is assign this order.</p>
          )}
        </div>
      </div>
    </div>
  )
}
