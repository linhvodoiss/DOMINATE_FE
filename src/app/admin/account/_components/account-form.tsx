import { Button, Form, Input, Switch } from 'antd'

import { FormInstance } from 'antd'
import CustomModalForm from '../../_components/custom-modal-form'

import { useEffect } from 'react'
import { User } from '#/user'

interface Props {
  visible: boolean
  onCancel: () => void
  onFinish: (values: User) => void
  modalType: 'add' | 'edit' | 'change password'
  editRecord: User | null
  form: FormInstance
}

export default function AccountForm({ visible, onCancel, onFinish, modalType, form, editRecord }: Props) {
  useEffect(() => {
    if (visible) {
      if (modalType === 'add') {
        form.resetFields()
      } else if (modalType === 'edit' && editRecord) {
        form.setFieldsValue({
          ...editRecord,
          status: editRecord.status === 'ACTIVE' ? true : false,
        })
      }
    }
  }, [visible, modalType, editRecord, form])

  const handleFinish = (values: User) => {
    const processedValues: User = {
      ...values,
      status: values.status ? 1 : 0,
    }
    onFinish(processedValues)
  }

  return (
    <CustomModalForm
      visible={visible}
      onCancel={onCancel}
      onFinish={handleFinish}
      modalTitle={modalType === 'add' ? 'Add Account' : modalType === 'edit' ? 'Update Account' : 'Change Password'}
      form={form}
      footer={
        <>
          <Button
            type='primary'
            htmlType='submit'
            className='!bg-primary-system !border-primary-system'
            onClick={() => form.submit()}
          >
            {modalType === 'add' ? 'Add' : modalType === 'edit' ? 'Update' : 'Change Password'}
          </Button>
          <Button type='primary' onClick={onCancel} className='!border-primary-system !bg-red-500'>
            Close
          </Button>
        </>
      }
    >
      {modalType !== 'change password' && (
        <>
          {modalType === 'add' ? (
            <Form.Item
              name='userName'
              label='User name'
              rules={[{ required: true, message: 'Please input username!' }]}
            >
              <Input />
            </Form.Item>
          ) : (
            <Form.Item label='User name'>
              <Input value={editRecord?.userName} disabled />
            </Form.Item>
          )}
          <Form.Item
            name='firstName'
            label='First Name'
            rules={[{ required: true, message: 'Please input first name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='lastName' label='Last Name' rules={[{ required: true, message: 'Please input last name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='email' label='Email' rules={[{ required: true, message: 'Please input email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='phoneNumber'
            label='Phone Number'
            rules={[{ required: true, message: 'Please input phone number!' }]}
          >
            <Input />
          </Form.Item>
          {modalType === 'add' && (
            <Form.Item name='password' label='Password' rules={[{ required: true, message: 'Please input password!' }]}>
              <Input type='password' />
            </Form.Item>
          )}
          {modalType === 'edit' && (
            <>
              <Form.Item name='status' label='Active' valuePropName='checked' className='custom-switch'>
                <Switch className='custom-switch' checkedChildren='Active' unCheckedChildren='Inactive' />
              </Form.Item>
              <Form.Item name='isActive' label='Permission' valuePropName='checked' className='custom-switch'>
                <Switch className='custom-switch' checkedChildren='Permission' unCheckedChildren='Banned' />
              </Form.Item>
            </>
          )}
        </>
      )}
      {modalType === 'change password' && (
        <Form.Item
          name='newPassword'
          label='New Password'
          rules={[{ required: true, message: 'Please input new password!' }]}
        >
          <Input type='password' />
        </Form.Item>
      )}
    </CustomModalForm>
  )
}
