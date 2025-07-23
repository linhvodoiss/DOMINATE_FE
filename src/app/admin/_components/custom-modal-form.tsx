import { Modal, Form, Grid } from 'antd'
import { ReactNode, useEffect } from 'react'
import { FormInstance } from 'antd'

interface CustomModalFormProps {
  visible: boolean
  onCancel: () => void
  onFinish: (values: Record<string, unknown>) => void
  modalTitle?: string
  form: FormInstance
  children: ReactNode
}

export default function CustomModalForm({
  visible,
  onCancel,
  onFinish,
  modalTitle = 'Modal',
  form,
  children,
}: CustomModalFormProps) {
  useEffect(() => {
    if (visible) {
      form.resetFields()
    }
  }, [visible, form])
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  const isMobile = !screens.md

  return (
    <Modal title={modalTitle} open={visible} onCancel={onCancel} footer={null} centered>
      <Form
        form={form}
        layout={isMobile ? 'vertical' : 'horizontal'}
        labelCol={isMobile ? undefined : { span: 6 }}
        wrapperCol={isMobile ? undefined : { span: 18 }}
        onFinish={onFinish}
      >
        {children}
      </Form>
    </Modal>
  )
}
