import { OptionResponse } from './option'

export type PackageResponse = {
  id?: number
  name?: string
  price?: number
  discount?: number
  billingCycle?: string
  isActive?: boolean
  options?: OptionResponse[]

  simulatedCount?: number
  createdAt?: string
  updatedAt?: string
}
