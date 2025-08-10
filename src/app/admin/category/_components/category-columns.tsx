import { Space, Tag, Button, Popconfirm, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { SortOrder } from 'antd/es/table/interface'
import { CategoryResponse } from '#/category'

interface GetColumnsProps {
  sort: string
  handleEdit: (record: CategoryResponse) => void
  handleDeleteOne: (id: string | number) => void
}

export default function getCategoryColumns({ sort, handleEdit, handleDeleteOne }: GetColumnsProps) {
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
      width: 100,
      ellipsis: true,
    },
    {
      title: 'Version',
      key: 'version',
      width: 120,
      render: (_: unknown, record: CategoryResponse) => {
        const versionName = record.version?.version || 'Unknown'
        const isVersionActive = record.version?.isActive

        return isVersionActive ? (
          <>{versionName}</>
        ) : (
          <Tag color='red' bordered={false}>
            {versionName}
          </Tag>
        )
      },
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 50,
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
      render: (_: unknown, record: CategoryResponse) => {
        const isVersionActive = record.version?.isActive
        console.log(record.version)
        return (
          <Space>
            <Tooltip title={isVersionActive ? 'Edit' : 'Can not edit'}>
              <Button
                type='link'
                icon={<EditOutlined />}
                disabled={!isVersionActive}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            <Popconfirm
              title='Are you sure want to delete this category?'
              onConfirm={() => handleDeleteOne(record.id as number)}
              okText='OK'
              cancelText='Close'
              placement='bottom'
            >
              <Button type='link' danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        )
      },
    },
  ]
}
