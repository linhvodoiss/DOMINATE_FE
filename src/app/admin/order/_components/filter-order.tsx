import { Button, Input, Select } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
const { Option } = Select
export default function FilterOrder() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
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
    setStatus('')
    setType('')
    router.replace(window.location.pathname)
  }

  return (
    <div className='mb-6 flex flex-wrap items-center gap-3'>
      <Input
        placeholder='Find order follow code and name package...'
        className='!h-10 !w-100 rounded-md shadow-sm'
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
      <Select
        placeholder='Filter status'
        className='!h-10 !w-48'
        allowClear
        value={status || undefined}
        onChange={value => {
          setStatus(value)
          handleFilterChange('status', value)
        }}
      >
        <Option value='PENDING'>Pending</Option>
        <Option value='PROCESSING'>Processing</Option>
        <Option value='SUCCESS'>Success</Option>
        <Option value='FAILED'>Failed</Option>
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
      <Button
        onClick={handleReset}
        className='filter-table flex items-center justify-center'
        icon={<ReloadOutlined />}
        shape='circle'
        title='Reset bộ lọc'
      />
    </div>
  )
}
