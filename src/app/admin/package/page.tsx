'use client'

import { Table, Input, Button, Space } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType, ColumnType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { useRef, useState } from 'react'
import type { InputRef } from 'antd'

interface Package {
  key: string
  name: string
  price: string
  duration: string
}

type DataIndex = keyof Package

const data: Package[] = [
  {
    key: '1',
    name: 'Gói cơ bản',
    price: '100.000đ',
    duration: '1 tháng',
  },
  {
    key: '2',
    name: 'Gói nâng cao',
    price: '250.000đ',
    duration: '3 tháng',
  },
  {
    key: '3',
    name: 'Gói VIP',
    price: '500.000đ',
    duration: '12 tháng',
  },
]

export default function PackagePage() {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Package> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          className='mb-2 block w-60'
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            className='w-20'
          >
            Tìm
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size='small' className='w-20'>
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined className={filtered ? 'text-blue-500' : undefined} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
  })

  const columns: ColumnsType<Package> = [
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      ...getColumnSearchProps('price'),
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      filters: [
        { text: '1 tháng', value: '1 tháng' },
        { text: '3 tháng', value: '3 tháng' },
        { text: '12 tháng', value: '12 tháng' },
      ],
      onFilter: (value, record) => record.duration.indexOf(value as string) === 0,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type='link' icon={<EditOutlined />} onClick={() => console.log('Edit', record)}>
            Sửa
          </Button>
          <Button type='link' danger icon={<DeleteOutlined />} onClick={() => console.log('Delete', record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className='min-h-[500px] rounded p-6 shadow'>
      <h2 className='mb-4 text-xl font-semibold'>Danh sách gói</h2>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        className='bg-background [&_.ant-table]:!bg-background [&_.ant-table-thead>tr>th]:!bg-primary-system [&_.ant-table-tbody>tr>.ant-table-cell-row-hover]:!bg-primary-foreground-hover [&_.ant-table-thead>tr>th]:!text-[#FBFBFB]'
      />
    </div>
  )
}
