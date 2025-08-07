'use client'

import { Button, Descriptions, Tag, Divider, Radio, Form } from 'antd'
import React, { useEffect, useState, useTransition } from 'react'
import { paymentStatusMap, statusColorMap } from '~/constants/payment-type'
import { OrderResponse } from '#/order'
import { billingCycleMap, typePackageMap } from '~/constants/package-type'
import { BIN_BANK_MAP } from '~/constants/bank-list'
import { useRouter } from 'next/navigation'
import { CODE_SUCCESS } from '~/constants'
import { toast } from 'sonner'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { LicenseResponse } from '#/licenses'
import { subscribeOnce } from '~/app/_components/socket-link'
import { OrderStatusEnum } from '#/tabs-order'
import CancelReasonModal from './modal-cancel-preview'

const colResponsive = { xs: 1, sm: 1, md: 1, lg: 1 }

function getStatusInfo(status: string | null | undefined) {
  return {
    label: paymentStatusMap[status as keyof typeof paymentStatusMap] || 'Unknown',
    color: statusColorMap[status as keyof typeof statusColorMap] || 'default',
  }
}

export default function AdminOrderPreview({ data, id }: { data: OrderResponse; id: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [status, setStatus] = useState<string | null>(data.paymentStatus || null)
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false)
  const [cancelForm] = Form.useForm()

  const [cancelModalOpen, setCancelModalOpen] = useState(false)

  useEffect(() => {
    setStatus(data.paymentStatus || null)

    subscribeOnce('/topic/payment/global', client => {
      client.subscribe('/topic/payment/global', message => {
        const payload = JSON.parse(message.body)
        const info = getStatusInfo(payload.newStatus)

        toast.info(`Order ${payload.orderId} ${info.label}`)
        router.refresh()
      })
    })
  }, [data.paymentStatus, router])

  const handleUpdateStatus = () => {
    if (!status) return toast.error('Please select a status before updating')
    if (status === OrderStatusEnum.FAILED) {
      setCancelModalOpen(true)
      return
    }
    startTransition(async () => {
      const res = await http.patch(`${LINKS.order_admin}/${data.orderId}`, {
        params: { newStatus: status },
        baseUrl: '/api',
      })

      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message || 'Update status failed')
        return
      }
      if (status !== OrderStatusEnum.SUCCESS) {
        toast.success(res.message || 'Status updated successfully')
      }
      if (status === 'SUCCESS') {
        try {
          const licenseRes = await http.post<LicenseResponse>(LINKS.licenses_create, {
            body: JSON.stringify({ orderId: Number(id) }),
            baseUrl: '/api',
          })

          if (CODE_SUCCESS.includes(licenseRes.code)) {
            toast.success('License created successfully')
          } else {
            toast.error(licenseRes.message || 'Create license failed')
          }
        } catch {
          toast.error('Error while creating license')
        }
      }

      router.refresh()
    })
  }

  const getLicense = () => {
    startTransition(async () => {
      try {
        const licenseRes = await http.post<LicenseResponse>(LINKS.licenses_create, {
          body: JSON.stringify({ orderId: Number(id) }),
          baseUrl: '/api',
        })

        if (CODE_SUCCESS.includes(licenseRes.code)) {
          toast.success('License created successfully')
          router.refresh()
        } else {
          toast.error(licenseRes.message || 'Create license failed')
        }
      } catch {
        toast.error('Error while creating license')
      }
    })
  }

  const handleSyncBill = () => {
    startTransition(async () => {
      const res = await http.post(`${LINKS.payment_sync}/${Number(id)}`, {
        baseUrl: '/api',
      })
      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message || 'Sync failed')
        return
      }

      toast.success(res.message || 'Sync successfully')
      router.refresh()
    })
  }

  const statusInfo = getStatusInfo(data.paymentStatus)
  const filteredStatusOptions = Object.entries(paymentStatusMap).filter(([key]) => {
    if (
      (data.paymentStatus === OrderStatusEnum.PENDING || data.paymentStatus === OrderStatusEnum.PROCESSING) &&
      (key === OrderStatusEnum.PENDING || key === OrderStatusEnum.PROCESSING)
    ) {
      return false
    }
    return true
  })

  return (
    <div className='max-w-7xl p-6'>
      <h2 className='!mb-4 !text-2xl !font-bold'># Order Code {id}</h2>
      {(data.paymentStatus === OrderStatusEnum.PENDING || data.paymentStatus === OrderStatusEnum.PROCESSING) && (
        <>
          <Radio.Group optionType='button' buttonStyle='solid' value={status} onChange={e => setStatus(e.target.value)}>
            {filteredStatusOptions.map(([key, label]) => (
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
          {(status === OrderStatusEnum.SUCCESS || status === OrderStatusEnum.FAILED) && (
            <Button
              type='primary'
              loading={isPending}
              onClick={handleUpdateStatus}
              className='!bg-primary-system !border-primary-system mt-4 !block'
            >
              Update
            </Button>
          )}
        </>
      )}
      <div className='mt-6 grid grid-cols-1 gap-6'>
        {/* Order Info */}
        <div>
          <Divider orientation='left'>Order Information</Divider>
          <Descriptions bordered size='middle' column={colResponsive}>
            <Descriptions.Item label='Order ID'>{id}</Descriptions.Item>
            <Descriptions.Item label='Payment Status'>
              <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Total Price'>
              {data.price != null ? data.price.toLocaleString('vi-VN') + '₫' : '--'}
            </Descriptions.Item>

            <Descriptions.Item label='Created At'>{data.createdAt}</Descriptions.Item>
          </Descriptions>
        </div>

        {/* Package */}
        <div>
          <Divider orientation='left'>Package</Divider>
          {data.subscription ? (
            <Descriptions bordered size='middle' column={colResponsive}>
              <Descriptions.Item label='Package Name'>{data.subscription.name}</Descriptions.Item>
              <Descriptions.Item label='Original Price'>
                {data.subscription?.price != null ? data.subscription.price.toLocaleString('vi-VN') + '₫' : '--'}
              </Descriptions.Item>

              <Descriptions.Item label='Discount'>{data.subscription.discount}%</Descriptions.Item>
              <Descriptions.Item label='Billing Cycle'>
                {billingCycleMap[data.subscription.billingCycle as keyof typeof billingCycleMap] ||
                  data.subscription.billingCycle}
              </Descriptions.Item>
              <Descriptions.Item label='Package Type'>
                {typePackageMap[data.subscription.typePackage as keyof typeof typePackageMap] ||
                  data.subscription.typePackage}
              </Descriptions.Item>
              <Descriptions.Item label='Is Active'>{data.subscription.isActive ? 'Yes' : 'No'}</Descriptions.Item>
              <Descriptions.Item label='Options' span={2}>
                <ul className='list-disc pl-4'>
                  {(showMoreOptions ? data.subscription.options : data.subscription.options?.slice(0, 4))?.map(opt => (
                    <li key={opt.id}>{opt.name}</li>
                  ))}
                </ul>

                {(data.subscription.options?.length ?? 0) > 4 && (
                  <Button
                    type='link'
                    size='small'
                    onClick={() => setShowMoreOptions(prev => !prev)}
                    className='mt-1 p-0'
                  >
                    {showMoreOptions ? 'Hide' : 'View more'}
                  </Button>
                )}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <p>No subscription data available.</p>
          )}
        </div>

        {/* Customer */}
        <div>
          <Divider orientation='left'>Customer</Divider>
          {data.buyer ? (
            <Descriptions bordered size='middle' column={colResponsive}>
              <Descriptions.Item label='User Name'>{data.buyer.userName}</Descriptions.Item>
              <Descriptions.Item label='Full Name'>
                {data.buyer.firstName} {data.buyer.lastName}
              </Descriptions.Item>
              <Descriptions.Item label='Email'>{data.buyer.email}</Descriptions.Item>
              <Descriptions.Item label='Phone Number'>{data.buyer.phoneNumber}</Descriptions.Item>
              {data.paymentStatus !== OrderStatusEnum.FAILED && !data.accountName ? (
                <Descriptions.Item label='Sync'>
                  <Button
                    type='primary'
                    loading={isPending}
                    onClick={handleSyncBill}
                    className='!bg-primary-system !border-primary-system mt-4 !inline-block w-32 px-4'
                  >
                    Sync bill
                  </Button>
                </Descriptions.Item>
              ) : (
                <>
                  {data.accountName && (
                    <>
                      <Descriptions.Item label='Account Name'>{data.accountName}</Descriptions.Item>
                      <Descriptions.Item label='Account Number'>{data.accountNumber}</Descriptions.Item>
                      <Descriptions.Item label='Account Bank'>
                        {data?.bin && BIN_BANK_MAP[data.bin] ? BIN_BANK_MAP[data.bin] : data?.bin || '--'}
                      </Descriptions.Item>
                      <Descriptions.Item label='Date Transfer'>{data?.dateTransfer}</Descriptions.Item>
                    </>
                  )}
                </>
              )}

              {data.cancelReason && data.paymentStatus === OrderStatusEnum.FAILED && (
                <>
                  <Descriptions.Item label='Cancel Reason'>{data.cancelReason}</Descriptions.Item>
                  <Descriptions.Item label='Date Cancel'>{data?.dateTransfer}</Descriptions.Item>
                </>
              )}
            </Descriptions>
          ) : (
            <p>No user data available.</p>
          )}
        </div>

        {/* License */}
        {data.license ? (
          <Descriptions bordered size='middle' column={colResponsive}>
            <Descriptions.Item label='Key'>{data.license.licenseKey}</Descriptions.Item>
            <Descriptions.Item label='Day Lefts'>{data.license.daysLeft}</Descriptions.Item>
            <Descriptions.Item label='Used?'>{data.license.canUsed ? 'Yes' : 'No'}</Descriptions.Item>
            {data.license.activatedAt && (
              <Descriptions.Item label='Activated At'>{data.license.activatedAt}</Descriptions.Item>
            )}
          </Descriptions>
        ) : (
          <>
            <p>No key is assign this order.</p>
            {data.paymentStatus === OrderStatusEnum.SUCCESS && (
              <Button
                type='primary'
                loading={isPending}
                onClick={getLicense}
                className='!bg-primary-system !border-primary-system mt-4 !inline-block w-36 px-4'
              >
                Get License
              </Button>
            )}
          </>
        )}
      </div>
      <CancelReasonModal
        open={cancelModalOpen}
        confirmLoading={isPending}
        onCancel={() => {
          setCancelModalOpen(false)
          cancelForm.resetFields()
        }}
        onSubmit={(reason: string) => {
          setCancelModalOpen(false)
          startTransition(async () => {
            const res = await http.post(`${LINKS.payment_cancel}/${Number(data.orderId)}`, {
              params: { reason },
              baseUrl: '/api',
            })

            if (!CODE_SUCCESS.includes(res.code)) {
              toast.error(res.message || 'Cancel failed')
              return
            }

            toast.success(res.message || 'Order canceled')
            router.refresh()
          })
        }}
      />
    </div>
  )
}
