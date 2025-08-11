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

import getDocColumns from './doc-columns'
import FilterDoc from './filter-doc'
import DocForm from './doc-form'
import { DocResponse } from '#/doc'
import { CategoryResponse } from '#/category'
import { VersionResponse } from '#/version'

interface Props {
  listDoc: DocResponse[]
  pageNumber: number
  pageSize: number
  totalElements: number
}

export default function DocPage({ listDoc, pageNumber, totalElements, pageSize }: Props) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [categoryList, setCategoryList] = useState<CategoryResponse[]>([])
  const [versionList, setVersionList] = useState<VersionResponse[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, versionsRes] = await Promise.all([
          http.get<CategoryResponse[]>(LINKS.categories_list, { baseUrl: '/api' }),
          http.get<VersionResponse[]>(LINKS.versions_list, { baseUrl: '/api' }),
        ])

        setCategoryList(categoriesRes?.data ?? [])
        setVersionList(versionsRes?.data ?? [])
      } catch (error) {
        setCategoryList([])
        setVersionList([])
        console.error('Failed to fetch categories or versions:', error)
      }
    }

    fetchData()
  }, [])

  const handleDeleteMany = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('Please select at least one doc to delete')
      return
    }
    startTransition(async () => {
      const res = await http.delete(LINKS.docs, {
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
  const [editRecord, setEditRecord] = useState<DocResponse | null>(null)

  const [form] = Form.useForm()

  // Open modal for adding new doc
  // Reset form when opening add modal
  const handleAdd = () => {
    setModalType('add')
    setEditRecord(null)
    setIsModalOpen(true)
  }

  // Set modal type to edit and set record to edit
  // Reset form when opening edit modal
  const handleEdit = (record: DocResponse) => {
    setModalType('edit')
    setEditRecord(record)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditRecord(null)
    form.resetFields()
  }
  // Delete one doc
  // This function is called when the delete button is clicked
  const handleDeleteOne = async (id: string | number) => {
    startTransition(async () => {
      const res = await http.delete(`${LINKS.docs}/${id}`, {
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
  // Handle form submission for adding or editing doc
  // This function is called when the form is submitted
  const handleFinish = (values: DocResponse) => {
    if (modalType === 'add') {
      startTransition(async () => {
        const res = await http.post(LINKS.docs, {
          body: JSON.stringify(values),
          baseUrl: '/api',
        })
        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Add doc failed')
          return
        }
        toast.success(res.message || 'Add doc successfully')
        setIsModalOpen(false)
        router.refresh()
      })
    } else {
      startTransition(async () => {
        const res = await http.put(`${LINKS.docs}/${editRecord?.id}`, {
          body: JSON.stringify(values),
          baseUrl: '/api',
        })
        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Update doc failed')
          return
        }
        toast.success(res.message || 'Update doc successfully')
        setIsModalOpen(false)
        router.refresh()
      })
    }
  }
  const navigatePreview = (record: DocResponse) => {
    router.push(`/doc?docId=${record.id}`)
  }
  const columns = getDocColumns({ sort, handleEdit, handleDeleteOne, navigatePreview })

  return (
    <div className='min-h-[500px] rounded p-6 shadow'>
      <h2 className='mb-4 text-xl font-semibold'>List Doc</h2>
      <FilterDoc categoryList={categoryList} versionList={versionList} />
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
        dataSource={listDoc}
        currentPage={pageNumber}
        totalItems={totalElements}
        pageSize={pageSize}
        rowKey='id'
        onSelectRows={keys => setSelectedRowKeys(keys)}
      />
      <DocForm
        categoryList={categoryList}
        visible={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        modalType={modalType}
        editRecord={editRecord}
        form={form}
      />
    </div>
  )
}
