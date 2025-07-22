import { Button, Input, Select } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
const { Option } = Select
export default function FilterPackage() {
  const searchParams = useSearchParams()
  const router = useRouter()
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
  return (
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
  )
}
