'use client'

import React from 'react'
import { Card, Col, Row } from 'antd'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DashBoardResponse } from '#/dashboard'
import numeral from 'numeral'
import { statusColorMap } from '~/constants/payment-type'

export default function DashBoardPage({ data }: { data?: DashBoardResponse }) {
  if (!data) return null

  // const paymentMethodData = Object.entries(data.ordersByPaymentMethod || {}).map(([type, value]) => ({
  //   name: type,
  //   value: Number(value),
  // }))

  // const revenueData = Object.entries(data.revenueByPaymentMethod || {}).map(([type, value]) => ({
  //   name: type,
  //   value: Number(value),
  // }))

  const statusData = Object.entries(data.ordersByStatus || {}).map(([type, value]) => ({
    name: type,
    value: Number(value),
  }))

  const colorMap: Record<string, string> = {
    SUCCESS: '#198754',
    PENDING: '#ffc107',
    FAILED: '#dc3545',
    PROCESSING: '#0d6efd',
    PAYOS: 'violet',
  }
  const labelMap: Record<string, string> = {
    SUCCESS: 'Success',
    PENDING: 'Pending',
    FAILED: 'Failed',
    PROCESSING: 'Processing',
    PAYOS: 'PayOS',
    BANK: 'Bank',
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text x={x} y={y} fill='white' textAnchor='middle' dominantBaseline='central' fontSize={12} fontWeight='bold'>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPieChart = (chartData: any[], title: string, useStatusColor = false) => {
    const isRevenue = title.includes('Revenue')
    return (
      <Card title={title}>
        <ResponsiveContainer width='100%' height={240}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              outerRadius={80}
              label={renderCustomLabel}
              labelLine={false}
            >
              {chartData.map(entry => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={(useStatusColor ? statusColorMap : colorMap)[entry.name] || '#8884d8'}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) =>
                isRevenue
                  ? [`${numeral(value).format('0,0')} ₫`, labelMap[name] || name]
                  : [`${numeral(value).format('0,0')} orders`, labelMap[name] || name]
              }
            />
            <Legend verticalAlign='top' height={36} formatter={(value: string) => labelMap[value] || value} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    )
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
        {/* <Col xs={24} md={8}>
          {renderPieChart(revenueData, 'Revenue by Payment Method')}
        </Col> */}
        <Col xs={24} md={8}>
          {renderPieChart(statusData, 'Orders by Status', true)}
        </Col>
        {/* <Col xs={24} md={8}>
          {renderPieChart(paymentMethodData, 'Orders by Payment Method')}
        </Col> */}
      </Row>
    </div>
  )
}
