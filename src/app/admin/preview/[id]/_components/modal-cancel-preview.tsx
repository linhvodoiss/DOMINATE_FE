import { Form, Input, Modal } from 'antd'
import React from 'react'

interface CancelReasonModalProps {
  open: boolean
  confirmLoading: boolean
  onCancel: () => void
  onSubmit: (reason: string) => void
}

export default function CancelReasonModal({ open, confirmLoading, onCancel, onSubmit }: CancelReasonModalProps) {
  const [form] = Form.useForm()

  return (
    <Modal
      open={open}
      title='Enter Cancel Reason'
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => {
        form.submit()
      }}
      confirmLoading={confirmLoading}
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
      <Form
        form={form}
        layout='vertical'
        onFinish={values => {
          onSubmit(values.cancelReason.trim())
          form.resetFields()
        }}
      >
        <Form.Item
          name='cancelReason'
          label='Cancel Reason'
          rules={[
            { required: true, message: 'Please enter a reason' },
            { max: 100, message: 'Reason must be 100 characters or less' },
          ]}
        >
          <Input.TextArea rows={4} placeholder='Enter reason...' maxLength={100} showCount />
        </Form.Item>
      </Form>
    </Modal>
  )
}
