'use client'
import { Form } from 'antd'

import TableAdmin from '../../_components/table-admin'

import { useRouter, useSearchParams } from 'next/navigation'

import { startTransition, useEffect, useState } from 'react'

import getOptionColumns from './order-columns'
import FilterOption from './filter-order'

import { OrderResponse } from '#/order'
import OrderForm from './order-form'
import http from '~/utils/http'
import { LINKS } from '~/constants/links'
import { CODE_SUCCESS } from '~/constants'
import { toast } from 'sonner'
import { getStompClient } from '~/app/_components/socket-link'

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
      const res = await http.patch(`${LINKS.order_admin}/${editRecord?.orderId}`, {
        params: {
          newStatus: values.paymentStatus,
        },
        baseUrl: '/api',
      })
      if (!CODE_SUCCESS.includes(res.code)) {
        toast.error(res.message || 'Update status failed')
        return
      }

      toast.success(res.message || 'Update status successfully')
      setIsModalOpen(false)
      router.refresh()
    })
  }

  // socket

  useEffect(() => {
    const client = getStompClient()

    if (!client.connected) {
      client.connect({}, () => {
        client.subscribe('/topic/payment/global', message => {
          const payload = JSON.parse(message.body)

          console.log(' WebSocket Message:', payload)
          toast.info(`Đơn ${payload.orderId} cập nhật trạng thái: ${payload.newStatus}`)
          router.refresh()
        })
      })
    }

    return () => {
      if (client.connected) client.disconnect()
    }
  }, [router])

  useEffect(() => {
    const client = getStompClient()
    if (!client.connected) {
      client.connect({}, () => {
        console.log('[STOMP] Connected')
        client.subscribe('/topic/order/global', message => {
          const payload = JSON.parse(message.body)
          toast.info(`You have an new order: ${payload.orderId}`)
          router.refresh()
        })
      })
    }
    return () => {
      if (client.connected) client.disconnect()
    }
  }, [router])

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
