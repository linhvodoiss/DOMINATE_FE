'use client'

import { Button, Form, Space } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Popconfirm } from 'antd'
import TableAdmin from '../../_components/table-admin'
import { PackageResponse } from '#/package'
import { useRouter, useSearchParams } from 'next/navigation'

import FilterPackage from './filter-package'
import { useState, useTransition } from 'react'
import http from '~/utils/http'
import { CODE_SUCCESS } from '~/constants'
import { toast } from 'sonner'
import { LINKS } from '~/constants/links'

import getPackageColumns from './package-columns'
import PackageForm from './package-form'

interface Props {
  listPackage: PackageResponse[]
  pageNumber: number
  pageSize: number
  totalElements: number
}

export default function PackagePage({ listPackage, pageNumber, totalElements, pageSize }: Props) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [isPending, startTransition] = useTransition()
  const handleDeleteMany = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('Please select at least one package to delete')
      return
    }
    startTransition(async () => {
      const res = await http.delete(LINKS.subscriptions, {
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
  const [editRecord, setEditRecord] = useState<PackageResponse | null>(null)
  const [optionList, setOptionList] = useState<{ label: string; value: string | number }[]>([])

  const fetchOptions = async () => {
    const res = await http.get(LINKS.options_show_select, {
      baseUrl: '/api',
    })

    if (res.data && Array.isArray(res.data)) {
      setOptionList(res.data.map(opt => ({ label: opt.name, value: opt.id })))
    } else {
      setOptionList([])
    }
  }
  const [form] = Form.useForm()

  // Open modal for adding new package
  // Reset form when opening add modal
  const handleAdd = () => {
    setModalType('add')
    setEditRecord(null)
    setIsModalOpen(true)
    fetchOptions()
  }

  // Set modal type to edit and set record to edit
  // Reset form when opening edit modal
  const handleEdit = (record: PackageResponse) => {
    setModalType('edit')
    setEditRecord(record)
    setIsModalOpen(true)
    fetchOptions()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditRecord(null)
    form.resetFields()
  }
  // Delete one package
  // This function is called when the delete button is clicked
  const handleDeleteOne = async (id: string | number) => {
    startTransition(async () => {
      const res = await http.delete(`${LINKS.subscriptions}/${id}`, {
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
  // Handle form submission for adding or editing package
  // This function is called when the form is submitted
  const handleFinish = async (values: PackageResponse) => {
    if (modalType === 'add') {
      startTransition(async () => {
        const res = await http.post(LINKS.subscriptions, {
          body: JSON.stringify(values),
          baseUrl: '/api',
        })
        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Add package failed')
          return
        }
        toast.success(res.message || 'Add package successfully')
        setIsModalOpen(false)
        router.refresh()
      })
    } else {
      startTransition(async () => {
        const res = await http.put(`${LINKS.subscriptions}/${editRecord?.id}`, {
          body: JSON.stringify(values),
          baseUrl: '/api',
        })
        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Update package failed')
          return
        }
        toast.success(res.message || 'Update package successfully')
        setIsModalOpen(false)
        router.refresh()
      })
    }
  }

  const columns = getPackageColumns({ sort, handleEdit, handleDeleteOne })

  return (
    <div className='min-h-[500px] rounded p-6 shadow'>
      <h2 className='mb-4 text-xl font-semibold'>List Package</h2>
      <FilterPackage />
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
        dataSource={listPackage}
        currentPage={pageNumber}
        totalItems={totalElements}
        pageSize={pageSize}
        rowKey='id'
        onSelectRows={keys => setSelectedRowKeys(keys)}
      />
      <PackageForm
        visible={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        modalType={modalType}
        editRecord={editRecord}
        optionList={optionList}
        form={form}
        isPending={isPending}
      />
    </div>
  )
}
