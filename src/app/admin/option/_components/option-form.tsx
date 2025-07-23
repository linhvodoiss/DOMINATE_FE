import { Button, Col, Form, Input, Row, Switch } from 'antd'

import { FormInstance } from 'antd'
import CustomModalForm from '../../_components/custom-modal-form'
import { OptionResponse } from '#/option'
import { useEffect } from 'react'

interface Props {
  visible: boolean
  onCancel: () => void
  onFinish: (values: OptionResponse) => void
  modalType: 'add' | 'edit'
  editRecord: OptionResponse | null
  form: FormInstance
}

export default function OptionForm({ visible, onCancel, onFinish, modalType, form, editRecord }: Props) {
  useEffect(() => {
    if (visible) {
      if (modalType === 'add') {
        form.resetFields()
      } else if (modalType === 'edit' && editRecord) {
        form.setFieldsValue({
          ...editRecord,
        })
      }
    }
  }, [visible, modalType, editRecord, form])

  return (
    <CustomModalForm
      visible={visible}
      onCancel={onCancel}
      onFinish={onFinish}
      modalTitle={modalType === 'add' ? 'Add Option' : 'Update Option'}
      form={form}
    >
      <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Please input name!' }]}>
        <Input />
      </Form.Item>

      {modalType === 'edit' && (
        <Form.Item name='isActive' label='Active' valuePropName='checked' className='custom-switch'>
          <Switch className='custom-switch' checkedChildren='Active' unCheckedChildren='Inactive' />
        </Form.Item>
      )}
      <Form.Item wrapperCol={{ xs: { span: 24 }, md: { offset: 6, span: 18 } }}>
        <Row gutter={16}>
          <Col>
            <Button type='primary' htmlType='submit' className='!bg-primary-system !border-primary-system'>
              {modalType === 'add' ? 'Add' : 'Update'}
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
  return (
    <CustomModalForm
      visible={visible}
      onCancel={onCancel}
      onFinish={onFinish}
      modalTitle={modalType === 'add' ? 'Add Option' : 'Update Option'}
      form={form}
    >
      <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Please input name!' }]}>
        <Input />
      </Form.Item>

      {modalType === 'edit' && (
        <Form.Item name='isActive' label='Active' valuePropName='checked' className='custom-switch'>
          <Switch className='custom-switch' checkedChildren='Active' unCheckedChildren='Inactive' />
        </Form.Item>
      )}
      <Form.Item wrapperCol={{ xs: { span: 24 }, md: { offset: 6, span: 18 } }}>
        <Row gutter={16}>
          <Col>
            <Button type='primary' htmlType='submit' className='!bg-primary-system !border-primary-system'>
              {modalType === 'add' ? 'Add' : 'Update'}
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
