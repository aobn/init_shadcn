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

// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
}

// 登录响应数据
export interface LoginResponse {
  token: string
  user: User
}

// 注册请求参数
export interface RegisterParams {
  username: string
  password: string
  email: string
}