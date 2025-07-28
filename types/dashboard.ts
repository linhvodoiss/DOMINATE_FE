export type DashBoardResponse = {
  totalCustomers: number
  totalOrders: number
  totalRevenue: number

  ordersByStatus: {
    SUCCESS: number
    FAILED: number
    PROCESSING: number
    PENDING: number
    [key: string]: number
  }

  ordersByPaymentMethod: {
    BANK: number
    PAYOS: number
    [key: string]: number
  }

  revenueByPaymentMethod: {
    BANK: number
    PAYOS: number
    [key: string]: number
  }
}
