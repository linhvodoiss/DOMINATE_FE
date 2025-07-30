import { Button, Col, Descriptions, Divider, Form, FormInstance, Radio, Row, Tag } from 'antd'
import { useEffect } from 'react'
import CustomModalForm from '../../_components/custom-modal-form'
import { OrderResponse } from '#/order'
import { paymentStatusMap, statusColorMap } from '~/constants/payment-type'
import { EyeOutlined } from '@ant-design/icons'
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

  if (!editRecord) return null

  return (
    <CustomModalForm visible={visible} onCancel={onCancel} onFinish={onFinish} modalTitle='Detail Order' form={form}>
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
      <Form.Item
        name='paymentStatus'
        label='Select status'
        initialValue={editRecord.paymentStatus}
        rules={[{ required: true, message: 'Please select new status' }]}
      >
        <Radio.Group optionType='button' buttonStyle='solid'>
          {Object.entries(paymentStatusMap).map(([status, label]) => (
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
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col>
          <Button type='primary' htmlType='submit' className='!bg-primary-system !border-primary-system'>
            Update
          </Button>
        </Col>
        <Col>
          <Button type='primary' onClick={onCancel} className='!border-primary-system !bg-red-500'>
            Cancel
          </Button>
        </Col>
      </Row>
    </CustomModalForm>
  )
}
