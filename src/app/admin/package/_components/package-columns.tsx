import { Space, Tag, Button, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { PackageResponse } from '#/package'
import { SortOrder } from 'antd/es/table/interface'
import calPriceDiscount from '~/utils/price-discount-calculate'
import { billingCycleMap, typePackageMap } from '~/constants/package-type'

interface GetColumnsProps {
  sort: string
  handleEdit: (record: PackageResponse) => void
  handleDeleteOne: (id: string | number) => void
}

export default function getPackageColumns({ sort, handleEdit, handleDeleteOne }: GetColumnsProps) {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
      sortOrder: (sort === 'id,asc' ? 'ascend' : sort === 'id,desc' ? 'descend' : undefined) as SortOrder | undefined,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => price.toLocaleString('vi-VN') + ' đ',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: 100,
      render: (discount: number) => <p>{discount} %</p>,
    },
    {
      title: 'Price after discount',
      key: 'discountPrice',
      width: 140,
      render: (record: { price: number; discount: number }) => {
        const discountedPrice = calPriceDiscount(record.price, record.discount)
        return <span>{discountedPrice.toLocaleString('vi-VN')} đ</span>
      },
    },
    {
      title: 'Cycle',
      dataIndex: 'billingCycle',
      key: 'billingCycle',
      width: 120,
      render: (cycle: string) => billingCycleMap[cycle] || cycle,
    },
    {
      title: 'Type',
      dataIndex: 'typePackage',
      key: 'typePackage',
      width: 140,
      render: (type: string) => typePackageMap[type] || type,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'} bordered={false}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 120,
      render: (_: unknown, record: PackageResponse) => (
        <Space>
          <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title='Bạn có chắc chắn muốn xóa package này?'
            onConfirm={() => handleDeleteOne(record.id as number)}
            okText='Xóa'
            cancelText='Hủy'
            placement='bottom'
          >
            <Button type='link' danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]
}
