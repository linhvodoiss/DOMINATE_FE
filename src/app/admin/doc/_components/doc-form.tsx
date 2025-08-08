import { Button, Form, Input, Select, Switch } from 'antd'

import { FormInstance } from 'antd'
import CustomModalForm from '../../_components/custom-modal-form'

import { useEffect } from 'react'
import { DocResponse } from '#/doc'
import TextArea from 'antd/es/input/TextArea'
import { CategoryResponse } from '#/category'

interface Props {
  visible: boolean
  onCancel: () => void
  onFinish: (values: DocResponse) => void
  modalType: 'add' | 'edit'
  editRecord: DocResponse | null
  form: FormInstance
  categoryList: CategoryResponse[]
}

export default function DocForm({ visible, onCancel, onFinish, modalType, form, editRecord, categoryList }: Props) {
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
      modalTitle={modalType === 'add' ? 'Add Doc' : 'Update Doc'}
      form={form}
      footer={
        <>
          <Button
            type='primary'
            htmlType='submit'
            className='!bg-primary-system !border-primary-system'
            onClick={() => form.submit()}
          >
            {modalType === 'add' ? 'Add' : 'Update'}
          </Button>
          <Button type='primary' onClick={onCancel} className='!border-primary-system !bg-red-500'>
            Close
          </Button>
        </>
      }
    >
      <Form.Item name='title' label='Title' rules={[{ required: true, message: 'Please input title!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name='slug' label='Slug' rules={[{ required: true, message: 'Please input slug!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name='order' label='Order'>
        <Input type='number' className='!w-full' />
      </Form.Item>
      <Form.Item name='categoryId' label='Category'>
        <Select
          placeholder='Choose category'
          allowClear
          className='!h-10'
          options={categoryList?.map(item => ({
            label: item.name,
            value: item.id,
          }))}
        />
      </Form.Item>
      <Form.Item name='content' label='Content'>
        <TextArea autoSize={{ minRows: 3 }} />
      </Form.Item>

      {modalType === 'edit' && (
        <Form.Item name='isActive' label='Active' valuePropName='checked' className='custom-switch'>
          <Switch className='custom-switch' checkedChildren='Active' unCheckedChildren='Inactive' />
        </Form.Item>
      )}
    </CustomModalForm>
  )
}
