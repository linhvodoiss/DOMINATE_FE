'use client'

import { Button, Descriptions, Divider, Form, FormInstance, Input, Modal, Radio, Tag } from 'antd'
import { useEffect, useState } from 'react'
import CustomModalForm from '../../_components/custom-modal-form'
import { OrderResponse } from '#/order'
import { paymentStatusMap, statusColorMap } from '~/constants/payment-type'
import { EyeOutlined } from '@ant-design/icons'
import { OrderStatusEnum } from '#/tabs-order'

type OrderUpdatePayload = {
  orderId: number
  paymentStatus: OrderStatusEnum
  cancelReason?: string
  dateTransfer?: string
}

interface Props {
  visible: boolean
  onCancel: () => void
  onFinish: (values: OrderUpdatePayload) => void
  editRecord: OrderResponse | null
  form: FormInstance
}

export default function OrderForm({ visible, onCancel, onFinish, form, editRecord }: Props) {
  const [cancelReasonModalOpen, setCancelReasonModalOpen] = useState(false)
  const [status, setStatus] = useState<string>()
  useEffect(() => {
    if (visible && editRecord) {
      form.setFieldsValue({
        paymentStatus: editRecord.paymentStatus,
        cancelReason: '',
      })
      setStatus(editRecord.paymentStatus)
    }
  }, [visible, editRecord, form])

  if (!editRecord) return null

  const handleUpdateClick = async () => {
    try {
      const values = await form.validateFields(['paymentStatus'])

      if (values.paymentStatus === OrderStatusEnum.FAILED) {
        setCancelReasonModalOpen(true)
      } else {
        onFinish({
          orderId: Number(editRecord.orderId ?? 0),
          paymentStatus: values.paymentStatus,
        })
      }
    } catch {
      // validate error
    }
  }

  const handleCancelConfirm = async () => {
    try {
      const values = await form.validateFields(['cancelReason'])

      onFinish({
        orderId: Number(editRecord.orderId ?? 0),
        paymentStatus: OrderStatusEnum.FAILED,
        cancelReason: values.cancelReason,
        dateTransfer: new Date().toISOString(),
      })

      // Reset field after submitting
      form.setFieldsValue({ cancelReason: '' })
      setCancelReasonModalOpen(false)
    } catch {
      // validate error
    }
  }

  return (
    <>
      <CustomModalForm
        visible={visible}
        onCancel={onCancel}
        onFinish={() => {}}
        modalTitle='Detail Order'
        form={form}
        footer={
          <>
            {(editRecord.paymentStatus === OrderStatusEnum.PENDING ||
              editRecord.paymentStatus === OrderStatusEnum.PROCESSING) &&
              (status === OrderStatusEnum.SUCCESS || status === OrderStatusEnum.FAILED) && (
                <Button
                  type='primary'
                  className='!bg-primary-system !border-primary-system'
                  onClick={handleUpdateClick}
                >
                  Update
                </Button>
              )}

            <Button type='primary' onClick={onCancel} className='!border-primary-system !bg-red-500'>
              Close
            </Button>
          </>
        }
      >
        <Descriptions column={1} bordered size='middle'>
          <Descriptions.Item label='Code'>{editRecord.orderId}</Descriptions.Item>
          <Descriptions.Item label='Package name'>{editRecord.subscription?.name}</Descriptions.Item>
          <Descriptions.Item label='Price'>{editRecord.price?.toLocaleString()}₫</Descriptions.Item>
          <Descriptions.Item label='Status'>
            {editRecord.paymentStatus && (
              <Tag color={statusColorMap[editRecord.paymentStatus] || 'default'}>
                {paymentStatusMap[editRecord.paymentStatus] || editRecord.paymentStatus}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Link payment'>
            <Button
              type='link'
              href={`/admin/preview/${editRecord.orderId}`}
              target='_blank'
              rel='noopener noreferrer'
              icon={<EyeOutlined />}
            >
              Preview order
            </Button>
          </Descriptions.Item>
          <Descriptions.Item label='Created at'>{editRecord.createdAt}</Descriptions.Item>
        </Descriptions>
        <Divider />
        {(editRecord.paymentStatus === OrderStatusEnum.PENDING ||
          editRecord.paymentStatus === OrderStatusEnum.PROCESSING) && (
          <Form.Item
            name='paymentStatus'
            label='Select status'
            rules={[{ required: true, message: 'Please select new status' }]}
          >
            <Radio.Group
              optionType='button'
              buttonStyle='solid'
              value={status}
              onChange={e => {
                form.setFieldValue('paymentStatus', e.target.value)
                setStatus(e.target.value)
              }}
            >
              {Object.entries(paymentStatusMap)
                .filter(([status]) => {
                  const current = editRecord.paymentStatus
                  return !(
                    (current === OrderStatusEnum.PENDING || current === OrderStatusEnum.PROCESSING) &&
                    (status === OrderStatusEnum.PENDING || status === OrderStatusEnum.PROCESSING)
                  )
                })
                .map(([status, label]) => (
                  <Radio.Button
                    key={status}
                    value={status}
                    style={{
                      color: '#fff',
                      backgroundColor: statusColorMap[status],
                      transition: 'all 0.3s',
                    }}
                    className='custom-radio-button'
                  >
                    {label}
                  </Radio.Button>
                ))}
            </Radio.Group>
          </Form.Item>
        )}
      </CustomModalForm>

      <Modal
        open={cancelReasonModalOpen}
        title='Reason cancel order'
        onCancel={() => setCancelReasonModalOpen(false)}
        onOk={handleCancelConfirm}
        okButtonProps={{
          style: {
            backgroundColor: '#e11d48',
            borderColor: '#e11d48',
            color: 'white',
          },
        }}
        cancelButtonProps={{
          style: {
            backgroundColor: '#f1f5f9',
            color: '#1f2937',
          },
        }}
      >
        <Form form={form}>
          <Form.Item
            name='cancelReason'
            rules={[
              { required: true, message: 'Please enter reason cancel' },
              { max: 100, message: 'Max 100 characters' },
            ]}
          >
            <Input.TextArea rows={4} placeholder='Enter reason cancel...' maxLength={100} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
