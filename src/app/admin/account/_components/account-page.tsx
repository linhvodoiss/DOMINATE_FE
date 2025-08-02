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

import getAccountColumns from './account-columns'
import FilterAccount from './filter-account'
import AccountForm from './account-form'
import { User } from '#/user'

interface Props {
  listUser: User[]
  pageNumber: number
  pageSize: number
  totalElements: number
  user: User
}

export default function AccountPage({ listUser, pageNumber, totalElements, pageSize, user }: Props) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const handleDeleteMany = async () => {
    if (selectedRowKeys.length === 0) {
      toast.warning('Please select at least one account to delete')
      return
    }
    startTransition(async () => {
      const res = await http.delete(LINKS.account, {
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
  const [modalType, setModalType] = useState<'add' | 'edit' | 'change password'>('add')
  const [editRecord, setEditRecord] = useState<User | null>(null)

  const [form] = Form.useForm()

  // Open modal for adding new account
  // Reset form when opening add modal
  const handleAdd = () => {
    setModalType('add')
    setEditRecord(null)
    setIsModalOpen(true)
  }

  // Set modal type to edit and set record to edit
  // Reset form when opening edit modal
  const handleEdit = (record: User) => {
    setModalType('edit')
    setEditRecord(record)
    setIsModalOpen(true)
  }

  const handleChangePassword = (record: User) => {
    setModalType('change password')
    setEditRecord(record)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditRecord(null)
    form.resetFields()
  }
  // Delete one account
  // This function is called when the delete button is clicked
  const handleDeleteOne = async (id: string | number) => {
    startTransition(async () => {
      const res = await http.delete(`${LINKS.account}/${id}`, {
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
  // Handle form submission for adding or editing account
  // This function is called when the form is submitted
  const handleFinish = (values: User) => {
    if (modalType === 'add') {
      startTransition(async () => {
        const res = await http.post(LINKS.account, {
          body: JSON.stringify(values),
          baseUrl: '/api',
        })
        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Add account failed')
          return
        }
        toast.success(res.message || 'Add account successfully')
        setIsModalOpen(false)
        router.refresh()
      })
    } else if (modalType === 'edit') {
      startTransition(async () => {
        const res = await http.put(`${LINKS.account}/${editRecord?.id}`, {
          body: JSON.stringify(values),
          baseUrl: '/api',
        })
        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Update account failed')
          return
        }
        toast.success(res.message || 'Update account successfully')
        setIsModalOpen(false)
        router.refresh()
      })
    } else {
      startTransition(async () => {
        const res = await http.patch(`${LINKS.account_change_pass}/${editRecord?.id}`, {
          body: JSON.stringify(values),
          baseUrl: '/api',
        })
        if (!CODE_SUCCESS.includes(res.code)) {
          toast.error(res.message || 'Change password failed')
          return
        }
        toast.success(res.message || 'Change password successfully')
        setIsModalOpen(false)
        router.refresh()
      })
    }
  }

  const columns = getAccountColumns({
    sort,
    handleEdit,
    handleDeleteOne,
    handleChangePassword,
    currentUserId: user.id as number,
  })

  return (
    <div className='min-h-[500px] rounded p-6 shadow'>
      <h2 className='mb-4 text-xl font-semibold'>List Account</h2>
      <FilterAccount />
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
        dataSource={listUser}
        currentPage={pageNumber}
        totalItems={totalElements}
        pageSize={pageSize}
        rowKey='id'
        onSelectRows={keys => setSelectedRowKeys(keys)}
      />
      <AccountForm
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
