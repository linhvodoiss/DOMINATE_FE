import { Button, Input, Select } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { CategoryResponse } from '#/category'
import { VersionResponse } from '#/version'
const { Option } = Select
export default function FilterDoc({
  categoryList,
  versionList,
}: {
  categoryList: CategoryResponse[]
  versionList: VersionResponse[]
}) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [active, setActive] = useState(searchParams.get('isActive') || '')
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '')
  const [versionId, setVersionId] = useState(searchParams.get('versionId') || '')
  const [search, setSearch] = useState(searchParams.get('search') || '')

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

    setActive('')
    setCategoryId('')
    setVersionId('')
    router.replace(window.location.pathname)
  }
  return (
    <div className='mb-6 flex flex-wrap items-center gap-3'>
      <Input
        placeholder='Find doc...'
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
      <Select
        placeholder='Choose category'
        className='!h-10 !w-48'
        allowClear
        value={categoryId || undefined}
        onChange={value => {
          setCategoryId(value)
          handleFilterChange('categoryId', value)
        }}
      >
        {categoryList?.map(item => (
          <Option value={item.id} key={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
      <Select
        placeholder='Choose version'
        className='!h-10 !w-48'
        allowClear
        value={versionId || undefined}
        onChange={value => {
          setVersionId(value)
          handleFilterChange('versionId', value)
        }}
      >
        {versionList?.map(item => (
          <Option value={item.id} key={item.id}>
            {item.version}
          </Option>
        ))}
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
