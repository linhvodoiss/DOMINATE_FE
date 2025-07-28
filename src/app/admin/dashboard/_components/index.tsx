'use client'

import React from 'react'
import { Card, Col, Row } from 'antd'
import { Pie } from '@ant-design/plots'
import { DashBoardResponse } from '#/dashboard'
import numeral from 'numeral'
import { statusColorMap } from '~/constants/payment-type'

export default function DashBoardPage({ data }: { data?: DashBoardResponse }) {
  if (!data) return null

  const paymentMethodData = Object.entries(data.ordersByPaymentMethod || {}).map(([type, value]) => ({
    type,
    value: Number(value),
  }))

  const revenueData = Object.entries(data.revenueByPaymentMethod || {}).map(([type, value]) => ({
    type,
    value: Number(value),
  }))

  const statusData = Object.entries(data.ordersByStatus || {}).map(([type, value]) => ({
    type,
    value: Number(value),
  }))

  const pieConfig = (chartData: any[], isStatusChart = false) => {
    const total = chartData.reduce((sum, d) => sum + d.value, 0)

    return {
      data: chartData,
      angleField: 'value',
      colorField: 'type',
      radius: 1,
      height: 240,
      autoFit: true,
      // Đổi màu thủ công nếu là chart theo status
      color: isStatusChart ? chartData.map(d => statusColorMap[d.type] || '#ccc') : undefined,

      label: {
        type: 'inner', // hoặc 'spider'
        content: (datum: { type: string; value: number }) => {
          const percent = total ? ((datum.value / total) * 100).toFixed(1) : '0'
          return `${datum.type}: ${percent}%`
        },
        style: {
          fontSize: 14,
          fill: '#fff',
        },
      },
      legend: {
        position: 'top',
      },
      interactions: [{ type: 'element-active' }],
    }
  }

  return (
    <div className='rounded p-6 shadow'>
      <h2 className='mb-4 text-xl font-semibold'>Dashboard Overview</h2>

      <Row gutter={[16, 16]} className='mb-4'>
        <Col xs={24} md={8}>
          <Card title='Total Customers'>
            <p className='text-2xl font-bold'>{data.totalCustomers}</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title='Total Orders'>
            <p className='text-2xl font-bold'>{data.totalOrders}</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title='Total Revenue'>
            <p className='text-2xl font-bold'>{numeral(data.totalRevenue).format('0,0')} đ</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title='Revenue by Payment Method'>
            <Pie {...pieConfig(revenueData)} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title='Orders by Status'>
            <Pie {...pieConfig(statusData, true)} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title='Orders by Payment Method'>
            <Pie {...pieConfig(paymentMethodData)} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
