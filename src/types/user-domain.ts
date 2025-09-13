/**
 * 用户域名管理相关类型定义
 */

// 用户域名信息接口
export interface UserDomainInfo {
  id: number
  userId: number
  username: string
  email: string
  subdomain: string
  domain: string
  fullDomain: string
  status: string
  remark: string
  createTime: string
  updateTime: string
}

// 用户域名查询请求参数
export interface AdminUserDomainQueryRequest {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  keyword?: string
  userId?: number
  status?: string
  domain?: string
}

// 用户域名查询响应
export interface AdminUserDomainResponse {
  code: number
  message: string
  data: {
    content: UserDomainInfo[]
    page: number
    size: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
  timestamp: string
}

// 域名状态选项
export const DomainStatusOptions = [
  { value: 'ACTIVE', label: '活跃' },
  { value: 'INACTIVE', label: '非活跃' },
  { value: 'DELETED', label: '已删除' }
] as const

// 排序字段选项
export const DomainSortByOptions = [
  { value: 'create_time', label: '创建时间' },
  { value: 'update_time', label: '更新时间' },
  { value: 'full_domain', label: '完整域名' },
  { value: 'status', label: '状态' }
] as const