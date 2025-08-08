'use client'
import { Button, Form, Space } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Popconfirm } from 'antd'
import TableAdmin from '../../_components/table-admin'

import { useRouter, useSearchParams } from 'next/navigation'

import { startTransition, useState } from 'react'
import http from '~/utils/http'
import { CODE_SUCCESS } from '~/constants'
import { toast } from 'sonner'
import { LINKS } from '~/constants/links'

import { VersionResponse } from '#/version'
import getVersionColumns from './version-columns'
import FilterVersion from './filter-version'

import VersionForm from './version-form'

interface Props {
  listVersion: VersionResponse[]
  pageNumber: number
  pageSize: number
  totalElements: number
}

export default function VersionPage({ listVersion, pageNumber, totalElements, pageSize }: Props) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  console.log(listVersion)

  const handleDeleteMany = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('Please select at least one version to delete')
      return
    }
    startTransition(async () => {
      const res = await http.delete(LINKS.versions, {
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
  const [editRecord, setEditRecord] = useState<VersionResponse | null>(null)

  const [form] = Form.useForm()

  // Open modal for adding new version
  // Reset form when opening add modal
  const handleAdd = () => {
    setModalType('add')
    setEditRecord(null)
    setIsModalOpen(true)
  }

  // Set modal type to edit and set record to edit
  // Reset form when opening edit modal
  const handleEdit = (record: VersionResponse) => {
    setModalType('edit')
    setEditRecord(record)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditRecord(null)
    form.resetFields()
  }
  // Delete one version
  // This function is called when the delete button is clicked
  const handleDeleteOne = async (id: string | number) => {
    startTransition(async () => {
      const res = await http.delete(`${LINKS.versions}/${id}`, {
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
  // Handle form submission for adding or editing version
  // This function is called when the form is submitted
  const handleFinish = (values: VersionResponse) => {
    if (modalType === 'add') {
      startTransition(async () => {
        const res = await http.post(LINKS.versions, {
          body: JSON.stringify(values),
          baseUrl: '/api',
        })
        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Add version failed')
          return
        }
        toast.success(res.message || 'Add version successfully')
        setIsModalOpen(false)
        router.refresh()
      })
    } else {
      startTransition(async () => {
        const res = await http.put(`${LINKS.versions}/${editRecord?.id}`, {
          body: JSON.stringify(values),
          baseUrl: '/api',
        })
        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Update version failed')
          return
        }
        toast.success(res.message || 'Update version successfully')
        setIsModalOpen(false)
        router.refresh()
      })
    }
  }

  const columns = getVersionColumns({ sort, handleEdit, handleDeleteOne })

  return (
    <div className='min-h-[500px] rounded p-6 shadow'>
      <h2 className='mb-4 text-xl font-semibold'>List Version</h2>
      <FilterVersion />
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
        dataSource={listVersion}
        currentPage={pageNumber}
        totalItems={totalElements}
        pageSize={pageSize}
        rowKey='id'
        onSelectRows={keys => setSelectedRowKeys(keys)}
      />
      <VersionForm
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
