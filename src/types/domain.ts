// 域名相关类型定义

// 用户域名信息
export interface UserDomainInfo {
  id: number                      // 域名ID
  userId: number                  // 用户ID
  username: string                // 用户名
  email: string                   // 用户邮箱
  subdomain: string               // 子域名前缀
  domain: string                  // 主域名
  fullDomain: string              // 完整域名
  status: string                  // 域名状态
  remark: string                  // 备注信息
  createTime: string              // 创建时间
  updateTime: string              // 更新时间
}

// 管理员获取用户域名查询请求参数
export interface AdminUserDomainQueryRequest {
  page?: number        // 页码，从1开始，默认1
  size?: number        // 每页大小，最少20，最大3000，默认20
  sortBy?: string      // 排序字段，默认create_time
  sortDir?: string     // 排序方向，ASC或DESC，默认DESC
  keyword?: string     // 搜索关键词，支持模糊查询用户名、邮箱、域名
  userId?: number      // 用户ID，精确查询指定用户的域名
  status?: string      // 域名状态过滤，ACTIVE、INACTIVE、DELETED
  domain?: string      // 主域名过滤
}

// 分页响应数据
export interface PaginatedResponse<T> {
  content: T[]                    // 数据列表
  page: number                    // 当前页码
  size: number                    // 每页大小
  total: number                   // 总记录数
  totalPages: number              // 总页数
  hasNext: boolean                // 是否有下一页
  hasPrevious: boolean            // 是否有上一页
}

// 管理员获取用户域名响应数据
export interface AdminUserDomainResponse {
  code: 200
  message: "获取用户域名列表成功"
  data: PaginatedResponse<UserDomainInfo>
  timestamp: string
}

// 域名状态常量
export const DomainStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE', 
  DELETED: 'DELETED'
} as const

export type DomainStatusType = typeof DomainStatus[keyof typeof DomainStatus]

// 排序字段常量
export const DomainSortBy = {
  CREATE_TIME: 'create_time',
  UPDATE_TIME: 'update_time',
  FULL_DOMAIN: 'full_domain',
  STATUS: 'status'
} as const

export type DomainSortByType = typeof DomainSortBy[keyof typeof DomainSortBy]

// 排序方向常量
export const SortDirection = {
  ASC: 'ASC',
  DESC: 'DESC'
} as const

export type SortDirectionType = typeof SortDirection[keyof typeof SortDirection]