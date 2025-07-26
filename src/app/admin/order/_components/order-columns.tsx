import { Space, Button, Tag } from 'antd'
import { EyeFilled } from '@ant-design/icons'
import { SortOrder } from 'antd/es/table/interface'
import { OrderResponse } from '#/order'
import { paymentMethodMap, paymentStatusMap, statusColorMap } from '~/constants/payment-type'
import { typePackageMap } from '~/constants/package-type'

interface GetColumnsProps {
  sort: string
  handleEdit: (record: OrderResponse) => void
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
