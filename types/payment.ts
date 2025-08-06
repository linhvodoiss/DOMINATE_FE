import { LicenseResponse } from './licenses'
import { PackageResponse } from './package'

export type PaymentResponse = {
  subscription?: PackageResponse
  license?: LicenseResponse
  bin: string
  accountNumber: string
  accountName: string
  currency: string
  paymentLinkId: string
  amount: number
  description: string
  orderCode: number
  status: string
  checkoutUrl: string
  price?: number
  qrCode: string
  cancelReason: string
  paymentStatus: string
  paymentLink: string
  dateTransfer: string
  createdAt?: string
  updatedAt?: string
  orderId: number
}

export type ResponseGlobal = {
  subscription?: PackageResponse
  license?: LicenseResponse
  bin: string
  accountNumber: string
  accountName: string
  currency: string
  paymentLinkId: string
  amount: number
  description: string
  price?: number
  orderCode: number
  status: string
  checkoutUrl: string
  qrCode: string
  paymentStatus: string
  paymentLink: string
  createdAt?: string
  updatedAt?: string
  canReport?: boolean
}
