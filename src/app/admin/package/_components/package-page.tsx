'use client'

import { Input, Button, Select, Space, Tag } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import TableAdmin from '../../_components/table-admin'
import { PackageResponse } from '#/package'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { SortOrder } from 'antd/es/table/interface'

const { Option } = Select

interface Props {
  listPackage: PackageResponse[]
  pageNumber: number
  pageSize: number
  totalElements: number
}

export default function PackagePage({ listPackage, pageNumber, totalElements, pageSize }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || ''

  const [cycle, setCycle] = useState(searchParams.get('cycle') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [active, setActive] = useState(searchParams.get('isActive') || '')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }
  const handleReset = () => {
    setSearch('')
    setCycle('')
    setType('')
    setActive('')
    setMinPrice('')
    setMaxPrice('')
    router.push(window.location.pathname)
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
          <Button type='link' icon={<EditOutlined />} onClick={() => console.log('Edit', record)} />
          <Button type='link' danger icon={<DeleteOutlined />} onClick={() => console.log('Delete', record)} />
        </Space>
      ),
    },
  ]

  return (
    <div className='min-h-[500px] rounded p-6 shadow'>
      <h2 className='mb-4 text-xl font-semibold'>List Package</h2>
      <div className='mb-6 flex flex-wrap items-center gap-3'>
        <Input
          placeholder='Find package...'
          className='!h-10 !w-60 rounded-md shadow-sm'
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          onPressEnter={() => handleFilterChange('search', search)}
          suffix={
            <SearchOutlined
              className='hover:text-primary cursor-pointer text-gray-400 transition'
              onClick={() => handleFilterChange('search', search)}
            />
          }
        />

        <Input
          placeholder='Min price'
          className='!h-10 !w-32'
          allowClear
          type='number'
          min={0}
          value={minPrice}
          onChange={e => {
            setMinPrice(e.target.value)
            handleFilterChange('minPrice', e.target.value)
          }}
        />

        <Input
          placeholder='Max price'
          className='!h-10 !w-32'
          allowClear
          type='number'
          min={0}
          value={maxPrice}
          onChange={e => {
            setMaxPrice(e.target.value)
            handleFilterChange('maxPrice', e.target.value)
          }}
        />

        <Select
          placeholder='Choose cycle'
          className='!h-10 !w-48'
          allowClear
          value={cycle || undefined}
          onChange={value => {
            setCycle(value)
            handleFilterChange('cycle', value)
          }}
        >
          <Option value='MONTHLY'>Month</Option>
          <Option value='HALF_YEARLY'>Half year</Option>
          <Option value='YEARLY'>An year</Option>
        </Select>

        <Select
          placeholder='Choose type'
          className='!h-10 !w-48'
          allowClear
          value={type || undefined}
          onChange={value => {
            setType(value)
            handleFilterChange('type', value)
          }}
        >
          <Option value='DEV'>Dev</Option>
          <Option value='RUNTIME'>Runtime</Option>
        </Select>

        <Select
          placeholder='Choose active'
          className='!h-10 !w-48'
          allowClear
          value={active || undefined}
          onChange={value => {
            setActive(value)
            handleFilterChange('isActive', value)
          }}
        >
          <Option value='true'>Active</Option>
          <Option value='false'>Inactive</Option>
        </Select>
        <Button
          onClick={handleReset}
          className='filter-table flex items-center justify-center'
          icon={<ReloadOutlined />}
          shape='circle'
          title='Reset bộ lọc'
        />
      </div>

      <TableAdmin
        columns={columns}
        dataSource={listPackage}
        currentPage={pageNumber}
        totalItems={totalElements}
        pageSize={pageSize}
        rowKey='id'
      />
    </div>
  )
}
