'use client'

import { Table } from 'antd'
import type { TableProps } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'

interface TableAdminProps<T> extends TableProps<T> {
  rowKey?: string
  totalItems?: number
  currentPage?: number
  pageSize?: number
  onSelectRows?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void
}

export default function TableAdmin<T extends object>({
  columns,
  dataSource,
  rowKey = 'key',
  totalItems,
  currentPage = 1,
  pageSize = 10,
  pagination,
  onSelectRows,
  ...rest
}: TableAdminProps<T>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePaginationChange = (page: number, pageSize: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    params.set('size', pageSize.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      rowSelection={
        onSelectRows
          ? {
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                onSelectRows(selectedRowKeys, selectedRows as T[])
              },
            }
          : undefined
      }
      onChange={(pagination, filters, sorter) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set('page', pagination.current?.toString() || '1')
        params.set('size', pagination.pageSize?.toString() || '10')

        if (!Array.isArray(sorter) && sorter.field && sorter.order) {
          params.set('sort', `${sorter.field},${sorter.order === 'ascend' ? 'asc' : 'desc'}`)
        } else {
          params.delete('sort')
        }

        router.push(`?${params.toString()}`)
      }}
      pagination={
        pagination === false
          ? false
          : {
              current: currentPage,
              total: totalItems,
              pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              onChange: handlePaginationChange,
              ...pagination,
            }
      }
      scroll={{ x: 'max-content' }}
      {...rest}
    />
  )
}
