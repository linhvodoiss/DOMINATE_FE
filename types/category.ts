import { VersionResponse } from './version'

export type CategoryResponse = {
  id?: number
  name?: string
  slug?: string
  order?: number
  versionId?: number
  version: VersionResponse
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}
