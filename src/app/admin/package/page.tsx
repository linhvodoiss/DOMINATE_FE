'use client'

import { Table, Input, Button, Select, Space, Pagination, PaginationProps } from 'antd'
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { useState } from 'react'

const { Option } = Select

interface Package {
  key: string
  name: string
  price: string
  duration: string
}

const originalData: Package[] = [
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
  {
    key: '4',
    name: 'Gói cơ bản',
    price: '100.000đ',
    duration: '1 tháng',
  },
  {
    key: '5',
    name: 'Gói nâng cao',
    price: '250.000đ',
    duration: '3 tháng',
  },
  {
    key: '6',
    name: 'Gói VIP',
    price: '500.000đ',
    duration: '12 tháng',
  },
  {
    key: '7',
    name: 'Gói cơ bản',
    price: '100.000đ',
    duration: '1 tháng',
  },
  {
    key: '8',
    name: 'Gói nâng cao',
    price: '250.000đ',
    duration: '3 tháng',
  },
  {
    key: '9',
    name: 'Gói VIP',
    price: '500.000đ',
    duration: '12 tháng',
  },
  {
    key: '10',
    name: 'Gói cơ bản',
    price: '100.000đ',
    duration: '1 tháng',
  },
  {
    key: '11',
    name: 'Gói nâng cao',
    price: '250.000đ',
    duration: '3 tháng',
  },
  {
    key: '12',
    name: 'Gói VIP',
    price: '500.000đ',
    duration: '12 tháng',
  },
  {
    key: '13',
    name: 'Gói cơ bản',
    price: '100.000đ',
    duration: '1 tháng',
  },
  {
    key: '14',
    name: 'Gói nâng cao',
    price: '250.000đ',
    duration: '3 tháng',
  },
  {
    key: '15',
    name: 'Gói VIP',
    price: '500.000đ',
    duration: '12 tháng',
  },
  {
    key: '16',
    name: 'Gói cơ bản',
    price: '100.000đ',
    duration: '1 tháng',
  },
  {
    key: '17',
    name: 'Gói nâng cao',
    price: '250.000đ',
    duration: '3 tháng',
  },
  {
    key: '18',
    name: 'Gói VIP',
    price: '500.000đ',
    duration: '12 tháng',
  },
]

export default function PackagePage() {
  const [searchName, setSearchName] = useState('')
  const [selectedDuration, setSelectedDuration] = useState<string | undefined>(undefined)

  const handleSearch = () => {
    // lọc lại dữ liệu nếu cần, nhưng ở đây ta lọc trực tiếp trong render
  }

  const filteredData = originalData.filter(pkg => {
    const matchName = pkg.name.toLowerCase().includes(searchName.toLowerCase())
    const matchDuration = selectedDuration ? pkg.duration === selectedDuration : true
    return matchName && matchDuration
  })

  const columns = [
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
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
    <div className='min-h-[500px] rounded shadow'>
      <h2 className='mb-4 text-xl font-semibold'>Danh sách gói</h2>

      {/* Bộ lọc riêng ngoài bảng */}
      <div className='mb-4 flex flex-wrap items-center gap-4'>
        <Input
          placeholder='Tìm tên gói...'
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className='w-60'
          allowClear
        />
        <Select
          placeholder='Chọn thời gian'
          value={selectedDuration}
          onChange={value => setSelectedDuration(value)}
          className='w-48'
          allowClear
        >
          <Option value='1 tháng'>1 tháng</Option>
          <Option value='3 tháng'>3 tháng</Option>
          <Option value='12 tháng'>12 tháng</Option>
        </Select>
        <Button icon={<SearchOutlined />} onClick={handleSearch} className='filter-table' variant='outlined'>
          Tìm kiếm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        className=''
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          onChange: (page, pageSize) => {
            console.log('Page:', page, 'PageSize:', pageSize)
          },
          onShowSizeChange: (current, size) => {
            console.log('PageSize changed to:', size)
          },
        }}
      />
    </div>
  )
}
