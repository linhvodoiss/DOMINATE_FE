'use client'
import { Form } from 'antd'

import TableAdmin from '../../_components/table-admin'

import { useRouter, useSearchParams } from 'next/navigation'

import { startTransition, useState } from 'react'

import getOptionColumns from './order-columns'
import FilterOption from './filter-order'

import { OrderResponse } from '#/order'
import OrderForm from './order-form'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { CODE_SUCCESS } from '~/constants'
import { toast } from 'sonner'

interface Props {
  listOrder: OrderResponse[]
  pageNumber: number
  pageSize: number
  totalElements: number
}

export default function OrderPage({ listOrder, pageNumber, totalElements, pageSize }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sort = searchParams.get('sort') || ''
  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [editRecord, setEditRecord] = useState<OrderResponse | null>(null)

  const [form] = Form.useForm()

  // Open modal for adding new option
  // Reset form when opening add modal

  // Set modal type to edit and set record to edit
  // Reset form when opening edit modal
  const handleEdit = (record: OrderResponse) => {
    console.log('handleEdit', record)
    setEditRecord(record)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditRecord(null)
    form.resetFields()
  }

  // Handle form submission for adding or editing option
  // This function is called when the form is submitted
  const handleFinish = (values: OrderResponse) => {
    startTransition(async () => {
      const res = await http.patch(`${LINKS.order}/${editRecord?.orderId}`, {
        params: {
          newStatus: values.paymentStatus,
        },
        baseUrl: '/api',
      })
      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message || 'Add option failed')
        return
      }
      toast.success(res.message || 'Add option successfully')
      setIsModalOpen(false)
      router.refresh()
    })
  }

  const columns = getOptionColumns({ sort, handleEdit })

  return (
    <div className='min-h-[500px] rounded p-6 shadow'>
      <h2 className='mb-4 text-xl font-semibold'>List Order</h2>
      <FilterOption />

      <TableAdmin
        columns={columns}
        dataSource={listOrder}
        currentPage={pageNumber}
        totalItems={totalElements}
        pageSize={pageSize}
        rowKey='id'
      />
      <OrderForm
        visible={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        editRecord={editRecord}
        form={form}
      />
    </div>
  )
}
