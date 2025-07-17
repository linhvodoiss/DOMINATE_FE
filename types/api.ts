export type BaseResponse<T> = {
  code: number
  message: string
  check?: boolean
  data?: T
  content?: T | [T]
  user?: T
  pageNumber?: number
  pageSize?: number
  totalElements?: number
  totalPages?: number
}

export type GiftReceived = { id: number; milestone: number }
