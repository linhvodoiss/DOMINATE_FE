import { OptionResponse } from './option'

export type PackageResponse = {
  id?: number
  name?: string
  price?: number
  discount?: number
  billingCycle?: string
  isActive?: boolean
  options?: OptionResponse[]
  typePackage?: string
  simulatedCount?: number
  createdAt?: string
  updatedAt?: string
}
