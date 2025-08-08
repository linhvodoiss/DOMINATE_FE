import { CategoryResponse } from './category'

export type DocResponse = {
  id?: number
  title?: string
  slug?: string
  content?: string
  order?: number
  categoryId?: number
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  category: CategoryResponse
}
