/**
 * 用户管理相关类型定义
 */

// 用户角色枚举
export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const

export type UserRoleValue = typeof UserRole[keyof typeof UserRole]

// 用户信息接口
export interface UserInfo {
  id: number
  username: string
  email: string
  role: UserRoleValue
  createTime: string
  updateTime: string
  domainCount: number
  dnsRecordCount: number
  lastLoginTime: string | null
  status: string | null
}

// 用户查询请求参数
export interface AdminUserQueryRequest {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  keyword?: string
  userId?: number
  role?: UserRoleValue
  createTimeStart?: string
  createTimeEnd?: string
}

// 用户查询响应
export interface AdminUserQueryResponse {
  code: number
  message: string
  data: {
    content: UserInfo[]
    page: number
    size: number
    total: number
    totalPages: number
    first: boolean
    last: boolean
    hasNext: boolean
    hasPrevious: boolean
  }
  timestamp: string
}

// 排序字段选项
export const UserSortByOptions = [
  { value: 'id', label: '用户ID' },
  { value: 'username', label: '用户名' },
  { value: 'email', label: '邮箱' },
  { value: 'create_time', label: '创建时间' },
  { value: 'update_time', label: '更新时间' }
] as const

// 排序方向选项
export const UserSortDirOptions = [
  { value: 'DESC', label: '降序' },
  { value: 'ASC', label: '升序' }
] as const

// 用户角色选项
export const UserRoleOptions = [
  { value: 'USER', label: '普通用户' },
  { value: 'ADMIN', label: '管理员' }
] as const