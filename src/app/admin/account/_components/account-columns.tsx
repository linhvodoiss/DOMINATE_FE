import { Space, Tag, Button, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons'

import { SortOrder } from 'antd/es/table/interface'
import { User } from '#/user'

interface GetColumnsProps {
  sort: string
  handleEdit: (record: User) => void
  handleDeleteOne: (id: string | number) => void
  handleChangePassword: (record: User) => void
  currentUserId: number
}

export default function getAccountColumns({
  sort,
  handleEdit,
  handleDeleteOne,
  handleChangePassword,
  currentUserId,
}: GetColumnsProps) {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: true,
      sortOrder: (sort === 'id,asc' ? 'ascend' : sort === 'id,desc' ? 'descend' : undefined) as SortOrder | undefined,
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
      width: 140,
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 140,
      ellipsis: true,
    },
    {
      title: 'Active',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (isActive: string) => (
        <Tag color={isActive === 'ACTIVE' ? 'green' : 'red'} bordered={false}>
          {isActive === 'ACTIVE' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Permission',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'} bordered={false}>
          {isActive ? 'Accepted' : 'Banned'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      width: 140,
      fixed: 'right' as const,
      render: (_: unknown, record: User) => {
        if (record.id === currentUserId) return null
        return (
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
            <Button type='link' icon={<LockOutlined />} onClick={() => handleChangePassword(record as User)} />
          </Space>
        )
      },
    },
  ]
}
