import { Space, Tag, Button, Popconfirm, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined, FileSearchOutlined } from '@ant-design/icons'

import { SortOrder } from 'antd/es/table/interface'
import { DocResponse } from '#/doc'

interface GetColumnsProps {
  sort: string
  handleEdit: (record: DocResponse) => void
  navigatePreview: (record: DocResponse) => void
  handleDeleteOne: (id: string | number) => void
}

export default function getDocColumns({ sort, handleEdit, handleDeleteOne, navigatePreview }: GetColumnsProps) {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      sorter: true,
      sortOrder: (sort === 'id,asc' ? 'ascend' : sort === 'id,desc' ? 'descend' : undefined) as SortOrder | undefined,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 80,
      ellipsis: true,
    },
    {
      title: 'Category',
      key: 'category',
      width: 80,
      render: (_: unknown, record: DocResponse) => {
        const categoryName = record.category.name || 'Unknown'
        const isCategoryActive = record.category?.isActive

        return isCategoryActive ? (
          <>{categoryName}</>
        ) : (
          <Tag color='red' bordered={false}>
            {categoryName}
          </Tag>
        )
      },
    },
    {
      title: 'Version',
      key: 'version',
      width: 80,
      render: (_: unknown, record: DocResponse) => {
        const versionName = record.category?.version?.version || 'Unknown'
        const isVersionActive = record.category?.version?.isActive

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
      render: (_: unknown, record: DocResponse) => {
        const isCategoryActive = record.category?.isActive
        const isVersionActive = record.category?.version?.isActive
        const isEditable = isCategoryActive && isVersionActive

        let tooltipMessage = 'Edit'
        if (!isCategoryActive && !isVersionActive) {
          tooltipMessage = 'Cannot edit because version and category inactive.'
        } else if (!isCategoryActive) {
          tooltipMessage = 'Cannot edit because category inactive.'
        } else if (!isVersionActive) {
          tooltipMessage = 'Cannot edit because version inactive.'
        }

        return (
          <Space>
            <Tooltip title={tooltipMessage}>
              <Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} disabled={!isEditable} />
            </Tooltip>
            <Popconfirm
              title='Are you sure want to delete this doc?'
              onConfirm={() => handleDeleteOne(record.id as number)}
              okText='OK'
              cancelText='Close'
              placement='bottom'
            >
              <Button type='link' danger icon={<DeleteOutlined />} />
            </Popconfirm>
            <Button
              type='link'
              icon={<FileSearchOutlined />}
              onClick={() => navigatePreview(record)}
              disabled={!isEditable}
            />
          </Space>
        )
      },
    },
  ]
}
