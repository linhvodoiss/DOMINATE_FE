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
  footer?: ReactNode
  width?: number | string
  labelCol?: number
  wrapperCol?: number
}

export default function CustomModalForm({
  visible,
  onCancel,
  onFinish,
  modalTitle = 'Modal',
  form,
  children,
  footer,
  width,
  labelCol = 6,
  wrapperCol = 18,
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
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={width}
      styles={{ body: { padding: 0, maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden' } }}
    >
      <Form
        className='!mt-6'
        form={form}
        layout={isMobile ? 'vertical' : 'horizontal'}
        labelCol={isMobile ? undefined : { span: labelCol }}
        wrapperCol={isMobile ? undefined : { span: wrapperCol }}
        onFinish={onFinish}
      >
        {children}
      </Form>

      <div className='bg-primary-foreground-hover sticky bottom-0 left-0 z-10 mx-auto flex w-full justify-center gap-6 pt-4'>
        {footer}
      </div>
    </Modal>
  )
}
