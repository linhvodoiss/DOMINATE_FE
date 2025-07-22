'use client'

import { Button, Col, Form, Grid, Input, InputNumber, Modal, Row, Select, Slider, Space, Switch, Tag } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import TableAdmin from '../../_components/table-admin'
import { PackageResponse } from '#/package'
import { useSearchParams } from 'next/navigation'

import { SortOrder } from 'antd/es/table/interface'
import FilterPackage from './filter-package'
import { useState } from 'react'

interface Props {
  listPackage: PackageResponse[]
  pageNumber: number
  pageSize: number
  totalElements: number
}
const billingCycleOptions = [
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Yearly', value: 'YEARLY' },
]

export default function PackagePage({ listPackage, pageNumber, totalElements, pageSize }: Props) {
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || ''
  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')
  const [editRecord, setEditRecord] = useState<PackageResponse | null>(null)
  const allOptions = listPackage.flatMap(pkg => pkg.options || [])
  const uniqueOptions = Array.from(new Map(allOptions.map(opt => [opt.id, opt])).values())
  const optionList = uniqueOptions.map(opt => ({
    label: opt.name,
    value: opt.id,
  }))
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const [form] = Form.useForm()

  // Reset form khi mở modal add
  const handleAdd = () => {
    setModalType('add')
    setEditRecord(null)
    setIsModalOpen(true)
    form.resetFields()
  }

  // Set giá trị form khi mở modal edit
  const handleEdit = (record: PackageResponse) => {
    setModalType('edit')
    setEditRecord(record)
    setIsModalOpen(true)
    form.setFieldsValue({
      ...record,
      options: record.options?.map(opt => opt.id),
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditRecord(null)
    form.resetFields()
  }

  const handleFinish = (values: any) => {
    if (modalType === 'add') {
      // Xử lý thêm mới
      console.log('Add:', values)
    } else {
      // Xử lý cập nhật
      console.log('Update:', { ...editRecord, ...values })
    }
    setIsModalOpen(false)
    form.resetFields()
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      sortOrder: (sort === 'id,asc' ? 'ascend' : sort === 'id,desc' ? 'descend' : undefined) as SortOrder | undefined,
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => <p>{discount} %</p>,
    },
    { title: 'Cycle', dataIndex: 'billingCycle', key: 'billingCycle' },
    { title: 'Type', dataIndex: 'typePackage', key: 'typePackage' },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'} bordered={false}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: PackageResponse) => (
        <Space>
          <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type='link' danger icon={<DeleteOutlined />} onClick={() => console.log('Delete', record)} />
        </Space>
      ),
    },
  ]

  return (
    <div className='min-h-[500px] rounded p-6 shadow'>
      <h2 className='mb-4 text-xl font-semibold'>List Package</h2>
      <FilterPackage />
      <Space className='mb-4 flex w-full justify-end'>
        <Button type='text' className='filter-table !px-8' onClick={handleAdd}>
          Add
        </Button>
      </Space>
      <TableAdmin
        columns={columns}
        dataSource={listPackage}
        currentPage={pageNumber}
        totalItems={totalElements}
        pageSize={pageSize}
        rowKey='id'
      />
      <Modal
        title={modalType === 'add' ? 'Add Package' : 'Update Package'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout={isMobile ? 'vertical' : 'horizontal'} // ✅ tự động thay đổi
          labelCol={isMobile ? undefined : { span: 6 }}
          wrapperCol={isMobile ? undefined : { span: 18 }}
          initialValues={{
            name: '',
            price: 0,
            discount: 0,
            billingCycle: 'MONTHLY',
            isActive: true,
            options: [],
          }}
          onFinish={handleFinish}
        >
          <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Please input name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item name='price' label='Price' rules={[{ required: true, type: 'number', min: 0 }]}>
            <Input type='number' className='!w-full' />
          </Form.Item>

          <Form.Item
            name='discount'
            label='Discount (%)'
            rules={[{ required: true, type: 'number', min: 0, max: 100 }]}
          >
            <Slider min={0} max={100} className='!w-full' />
          </Form.Item>

          <Form.Item name='billingCycle' label='Billing Cycle' rules={[{ required: true }]}>
            <Select options={billingCycleOptions} />
          </Form.Item>

          <Form.Item name='isActive' label='Active' valuePropName='checked' className='custom-switch'>
            <Switch className='custom-switch' checkedChildren='Active' unCheckedChildren='Inactive' />
          </Form.Item>

          <Form.Item name='options' label='Options' rules={[{ required: true }]}>
            <Select mode='multiple' options={optionList} placeholder='Select options' />
          </Form.Item>

          <Form.Item wrapperCol={{ xs: { span: 24 }, md: { offset: 6, span: 18 } }}>
            <Row gutter={16}>
              <Col>
                <Button type='primary' htmlType='submit' className='!bg-primary-system !border-primary-system'>
                  {modalType === 'add' ? 'Add' : 'Update'}
                </Button>
              </Col>
              <Col>
                <Button type='primary' onClick={handleCancel} className='!border-primary-system !bg-red-500'>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
