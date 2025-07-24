import { Space, Button, Tag } from 'antd'
import { EyeFilled } from '@ant-design/icons'
import { SortOrder } from 'antd/es/table/interface'
import { OrderResponse } from '#/order'

interface GetColumnsProps {
  sort: string
  handleEdit: (record: OrderResponse) => void
}
const typePackageMap: Record<string, string> = {
  DEV: 'Dev',
  RUNTIME: 'Runtime',
}
const paymentMethodMap: Record<string, string> = {
  BANK: 'Bank',
  PAYOS: 'PayOS',
}

const paymentStatusMap: Record<string, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SUCCESS: 'Success',
  FAILED: 'Canceled',
}
const statusColorMap: Record<string, string> = {
  PENDING: '#ffc107',
  PROCESSING: '#0d6efd',
  SUCCESS: '#198754',
  FAILED: '#dc3545',
}

export default function getOrderColumns({ sort, handleEdit }: GetColumnsProps) {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
      sortOrder: (sort === 'id,asc' ? 'ascend' : sort === 'id,desc' ? 'descend' : undefined) as SortOrder,
      ellipsis: true,
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 140,
      ellipsis: true,
      render: (method: string) => paymentMethodMap[method] || method,
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 120,
      ellipsis: true,
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>{paymentStatusMap[status] || status}</Tag>
      ),
    },
    {
      title: 'Name Package',
      dataIndex: ['subscription', 'name'],
      key: 'packageName',
      width: 160,
      ellipsis: true,
    },
    {
      title: 'Type Package',
      dataIndex: ['subscription', 'typePackage'],
      key: 'typePackage',
      width: 130,
      ellipsis: true,
      render: (type: string) => typePackageMap[type] || type,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      ellipsis: true,
      render: (price: number) => price.toLocaleString('vi-VN') + ' đ',
    },
    {
      title: 'Actions',
      key: 'action',
      width: 100,

      render: (_: unknown, record: OrderResponse) => (
        <Space>
          <Button type='link' icon={<EyeFilled />} onClick={() => handleEdit(record)} />
        </Space>
      ),
    },
  ]
}
