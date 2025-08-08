import { Space, Tag, Button, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { PackageResponse } from '#/package'
import { SortOrder } from 'antd/es/table/interface'
import { OptionResponse } from '#/option'

interface GetColumnsProps {
  sort: string
  handleEdit: (record: OptionResponse) => void
  handleDeleteOne: (id: string | number) => void
}

export default function getOptionColumns({ sort, handleEdit, handleDeleteOne }: GetColumnsProps) {
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
      width: 250,
      ellipsis: true,
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
      fixed: 'right' as const,
      width: 120,
      render: (_: unknown, record: PackageResponse) => (
        <Space>
          <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title='Are you sure want to delete this option ?'
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
