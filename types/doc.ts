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

export interface DocsCustomerResponse {
  versionId: number
  versionName: string
  categories: {
    categoryId: number
    categoryName: string
    docs: {
      docId: number
      docName: string
    }[]
  }[]
}
