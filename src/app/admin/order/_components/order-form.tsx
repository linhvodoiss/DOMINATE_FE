import { Button, Col, Form, Input, Row } from 'antd'

import { FormInstance } from 'antd'
import CustomModalForm from '../../_components/custom-modal-form'
import { useEffect } from 'react'
import { OrderResponse } from '#/order'

interface Props {
  visible: boolean
  onCancel: () => void
  onFinish: (values: OrderResponse) => void
  editRecord: OrderResponse | null
  form: FormInstance
}

export default function OrderForm({ visible, onCancel, onFinish, form, editRecord }: Props) {
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        ...editRecord,
      })
    }
  }, [visible, editRecord, form])

  return (
    <CustomModalForm visible={visible} onCancel={onCancel} onFinish={onFinish} modalTitle='View Order' form={form}>
      <Form.Item name='orderId' label='OrderID' rules={[{ required: true, message: 'Please input orderId!' }]}>
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ xs: { span: 24 }, md: { offset: 6, span: 18 } }}>
        <Row gutter={16}>
          <Col>
            <Button type='primary' htmlType='submit' className='!bg-primary-system !border-primary-system'>
              Update Status
            </Button>
          </Col>
          <Col>
            <Button type='primary' onClick={onCancel} className='!border-primary-system !bg-red-500'>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </CustomModalForm>
  )
}
