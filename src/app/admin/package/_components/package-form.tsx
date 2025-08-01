import { Button, Col, Form, Input, Row, Select, Slider, Switch } from 'antd'
import { useEffect } from 'react'
import { PackageResponse } from '#/package'

import { FormInstance } from 'antd'
import CustomModalForm from '../../_components/custom-modal-form'

interface Props {
  visible: boolean
  onCancel: () => void
  onFinish: (values: PackageResponse) => void
  modalType: 'add' | 'edit'
  editRecord: PackageResponse | null
  optionList: { label: string; value: string | number }[]
  form: FormInstance
  isPending: boolean
}

const billingCycleOptions = [
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Half yearly', value: 'HALF_YEARLY' },
  { label: 'Yearly', value: 'YEARLY' },
]
const typePackage = [
  { label: 'Dev', value: 'DEV' },
  { label: 'Runtime', value: 'RUNTIME' },
]

export default function PackageForm({
  visible,
  onCancel,
  onFinish,
  modalType,
  editRecord,
  optionList,
  form,
  isPending,
}: Props) {
  useEffect(() => {
    if (visible) {
      if (modalType === 'add') {
        form.resetFields()
      } else if (modalType === 'edit' && editRecord) {
        form.setFieldsValue({
          ...editRecord,
          optionsId: editRecord.options?.map(opt => opt.id),
        })
      }
    }
  }, [visible, modalType, editRecord, form])

  return (
    <CustomModalForm
      visible={visible}
      onCancel={onCancel}
      onFinish={onFinish}
      modalTitle={modalType === 'add' ? 'Add Package' : 'Update Package'}
      form={form}
    >
      <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Please input name!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name='price' label='Price'>
        <Input type='number' className='!w-full' />
      </Form.Item>
      <Form.Item name='simulatedCount' label='Simulated'>
        <Input type='number' className='!w-full' />
      </Form.Item>
      <Form.Item name='discount' label='Discount (%)' rules={[{ required: true, type: 'number', min: 0, max: 100 }]}>
        <Slider min={0} max={100} className='!w-full' />
      </Form.Item>
      <Form.Item name='billingCycle' label='Billing Cycle' rules={[{ required: true }]}>
        <Select options={billingCycleOptions} placeholder='Choose cycle' />
      </Form.Item>
      <Form.Item name='typePackage' label='Type Package' rules={[{ required: true }]}>
        <Select options={typePackage} placeholder='Choose type' />
      </Form.Item>
      {modalType === 'edit' && (
        <Form.Item name='isActive' label='Active' valuePropName='checked' className='custom-switch'>
          <Switch className='custom-switch' checkedChildren='Active' unCheckedChildren='Inactive' />
        </Form.Item>
      )}
      <Form.Item name='optionsId' label='Options' rules={[{ required: true }]}>
        <Select mode='multiple' options={optionList} placeholder='Select options' />
      </Form.Item>
      <Form.Item wrapperCol={{ xs: { span: 24 }, md: { offset: 6, span: 18 } }}>
        <Row gutter={16}>
          <Col>
            <Button
              type='primary'
              htmlType='submit'
              className='!bg-primary-system !border-primary-system'
              disabled={isPending}
            >
              {modalType === 'add' ? 'Add' : 'Update'}
            </Button>
          </Col>
          <Col>
            <Button
              type='primary'
              onClick={onCancel}
              className='!border-primary-system !bg-red-500'
              disabled={isPending}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </CustomModalForm>
  )
}
