import { OptionResponse } from './option'

export type PackageResponse = {
  id?: number
  name?: string
  description?: string
  price?: number
  discount?: number
  billingCycle?: string
  isActive?: boolean
  options?: OptionResponse[]
  typePackage?: string
  simulatedCount?: number
  realCount?: number
  totalCount?: number
  popular?: boolean
  createdAt?: string
  updatedAt?: string
}
