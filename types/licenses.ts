import { PackageResponse } from './package'

export type LicenseResponse = {
  licenseKey: string
  duration: number
  ip: string
  hardwareId: string
  isExpired: boolean
  daysLeft: number
  canUsed: boolean
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
  createdAt: string
  updatedAt?: string
  subscription: PackageResponse
  activatedAt?: string
}
