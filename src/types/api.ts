// API相关类型定义

// 统一API响应格式
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: string
}

// 分页响应数据
export interface PaginationData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 分页请求参数
export interface PaginationParams {
  page?: number
  pageSize?: number
}

// HTTP错误类型
export interface HttpError {
  code: number
  message: string
  status?: number
}