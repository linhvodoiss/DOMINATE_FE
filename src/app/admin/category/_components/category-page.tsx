'use client'
import { Button, Form, Space } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Popconfirm } from 'antd'
import TableAdmin from '../../_components/table-admin'

import { useRouter, useSearchParams } from 'next/navigation'

import { startTransition, useEffect, useState } from 'react'
import http from '~/utils/http'
import { CODE_SUCCESS } from '~/constants'
import { toast } from 'sonner'
import { LINKS } from '~/constants/links'

import getCategoryColumns from './category-columns'
import CategoryForm from './category-form'
import FilterCategory from './filter-category'
import { CategoryResponse } from '#/category'
import { VersionResponse } from '#/version'

interface Props {
  listCategory: CategoryResponse[]
  pageNumber: number
  pageSize: number
  totalElements: number
}

export default function CategoryPage({ listCategory, pageNumber, totalElements, pageSize }: Props) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [versionList, setVersionList] = useState<VersionResponse[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [versionsRes] = await Promise.all([http.get<VersionResponse[]>(LINKS.versions_list, { baseUrl: '/api' })])

        setVersionList(versionsRes?.data ?? [])
      } catch (error) {
        setVersionList([])
        console.error('Failed to fetch versions:', error)
      }
    }

    fetchData()
  }, [])

  const handleDeleteMany = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('Please select at least one Category to delete')
      return
    }
    startTransition(async () => {
      const res = await http.delete(LINKS.categories, {
        body: JSON.stringify(selectedRowKeys),
        baseUrl: '/api',
      })
      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message || 'Delete items failed')
        return
      }
      toast.success(res.message || 'Delete items successfully')
      setSelectedRowKeys([])
      router.refresh()
    })
  }
  const searchParams = useSearchParams()
  const router = useRouter()
  const sort = searchParams.get('sort') || ''
  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')
  const [editRecord, setEditRecord] = useState<CategoryResponse | null>(null)

  const [form] = Form.useForm()

  // Open modal for adding new Category
  // Reset form when opening add modal
  const handleAdd = () => {
    setModalType('add')
    setEditRecord(null)
    setIsModalOpen(true)
  }

  // Set modal type to edit and set record to edit
  // Reset form when opening edit modal
  const handleEdit = (record: CategoryResponse) => {
    setModalType('edit')
    setEditRecord(record)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditRecord(null)
    form.resetFields()
  }
  // Delete one Category
  // This function is called when the delete button is clicked
  const handleDeleteOne = async (id: string | number) => {
    startTransition(async () => {
      const res = await http.delete(`${LINKS.categories}/${id}`, {
        baseUrl: '/api',
      })
      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message || 'Delete failed')
        return
      }
      toast.success(res.message || 'Delete successfully')
      router.refresh()
    })
  }
  // Handle form submission for adding or editing Category
  // This function is called when the form is submitted
  const handleFinish = (values: CategoryResponse) => {
    if (modalType === 'add') {
      startTransition(async () => {
        const res = await http.post(LINKS.categories, {
          body: JSON.stringify(values),
          baseUrl: '/api',
        })
        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Add Category failed')
          return
        }
        toast.success(res.message || 'Add Category successfully')
        setIsModalOpen(false)
        router.refresh()
      })
    } else {
      startTransition(async () => {
        const res = await http.put(`${LINKS.categories}/${editRecord?.id}`, {
          body: JSON.stringify(values),
          baseUrl: '/api',
        })
        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Update Category failed')
          return
        }
        toast.success(res.message || 'Update Category successfully')
        setIsModalOpen(false)
        router.refresh()
      })
    }
  }

  const columns = getCategoryColumns({ sort, handleEdit, handleDeleteOne })

  return (
    <div className='min-h-[500px] rounded p-6 shadow'>
      <h2 className='mb-4 text-xl font-semibold'>List Category</h2>
      <FilterCategory versionList={versionList} />
      <Space className='mb-4 flex w-full justify-between'>
        <Popconfirm
          title='Are you sure want to delete those items?'
          onConfirm={handleDeleteMany}
          okText='OK'
          cancelText='Cancel'
          disabled={selectedRowKeys.length === 0}
          placement='bottom'
        >
          <Button
            type='primary'
            danger
            className='!ml-2'
            disabled={selectedRowKeys.length === 0}
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
        <Button type='text' className='filter-table !px-8' onClick={handleAdd}>
          Add
        </Button>
      </Space>
      <TableAdmin
        columns={columns}
        dataSource={listCategory}
        currentPage={pageNumber}
        totalItems={totalElements}
        pageSize={pageSize}
        rowKey='id'
        onSelectRows={keys => setSelectedRowKeys(keys)}
      />
      <CategoryForm
        visible={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        modalType={modalType}
        editRecord={editRecord}
        form={form}
        versionList={versionList}
      />
    </div>
  )
}
