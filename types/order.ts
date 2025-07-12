import { PackageResponse } from './package'

export type OrderResponse = {
  id?: number
  orderId?: string
  paymentLink?: string
  bin?: string
  accountName?: string
  accountNumber?: string
  qrCode?: string
  paymentStatus?: string
  paymentMethod?: string
  userId?: number
  subscriptionId?: number
  createdAt?: string
  updatedAt?: string
  subscription: PackageResponse
}
