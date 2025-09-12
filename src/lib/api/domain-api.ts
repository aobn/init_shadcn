import http from '@/lib/http'
import type { ApiResponse, PaginationData } from '@/types/api'
import type { 
  User, 
  Domain, 
  DnsRecord, 
  UserFormData, 
  DomainFormData, 
  DnsRecordFormData,
  QueryParams,
  DashboardStats
} from '@/types/domain'

// 仪表板API
export const dashboardApi = {
  // 获取统计数据
  getStats: (): Promise<ApiResponse<DashboardStats>> => {
    return http.get('/dashboard/stats')
  }
}

// 用户管理API
export const userApi = {
  // 获取用户列表
  getList: (params: QueryParams): Promise<ApiResponse<PaginationData<User>>> => {
    return http.get('/users', { params })
  },

  // 获取用户详情
  getById: (id: number): Promise<ApiResponse<User>> => {
    return http.get(`/users/${id}`)
  },

  // 创建用户
  create: (data: UserFormData): Promise<ApiResponse<User>> => {
    return http.post('/users', data)
  },

  // 更新用户
  update: (id: number, data: Partial<UserFormData>): Promise<ApiResponse<User>> => {
    return http.put(`/users/${id}`, data)
  },

  // 删除用户
  delete: (id: number): Promise<ApiResponse<null>> => {
    return http.delete(`/users/${id}`)
  },

  // 批量删除用户
  batchDelete: (ids: number[]): Promise<ApiResponse<null>> => {
    return http.post('/users/batch-delete', { ids })
  }
}

// 域名管理API
export const domainApi = {
  // 获取域名列表
  getList: (params: QueryParams): Promise<ApiResponse<PaginationData<Domain>>> => {
    return http.get('/domains', { params })
  },

  // 获取域名详情
  getById: (id: number): Promise<ApiResponse<Domain>> => {
    return http.get(`/domains/${id}`)
  },

  // 创建域名
  create: (data: DomainFormData): Promise<ApiResponse<Domain>> => {
    return http.post('/domains', data)
  },

  // 更新域名
  update: (id: number, data: Partial<DomainFormData>): Promise<ApiResponse<Domain>> => {
    return http.put(`/domains/${id}`, data)
  },

  // 删除域名
  delete: (id: number): Promise<ApiResponse<null>> => {
    return http.delete(`/domains/${id}`)
  },

  // 批量删除域名
  batchDelete: (ids: number[]): Promise<ApiResponse<null>> => {
    return http.post('/domains/batch-delete', { ids })
  },

  // 续费域名
  renew: (id: number, years: number): Promise<ApiResponse<Domain>> => {
    return http.post(`/domains/${id}/renew`, { years })
  }
}

// DNS管理API
export const dnsApi = {
  // 获取DNS记录列表
  getList: (params: QueryParams & { domainId?: number }): Promise<ApiResponse<PaginationData<DnsRecord>>> => {
    return http.get('/dns-records', { params })
  },

  // 获取DNS记录详情
  getById: (id: number): Promise<ApiResponse<DnsRecord>> => {
    return http.get(`/dns-records/${id}`)
  },

  // 创建DNS记录
  create: (data: DnsRecordFormData): Promise<ApiResponse<DnsRecord>> => {
    return http.post('/dns-records', data)
  },

  // 更新DNS记录
  update: (id: number, data: Partial<DnsRecordFormData>): Promise<ApiResponse<DnsRecord>> => {
    return http.put(`/dns-records/${id}`, data)
  },

  // 删除DNS记录
  delete: (id: number): Promise<ApiResponse<null>> => {
    return http.delete(`/dns-records/${id}`)
  },

  // 批量删除DNS记录
  batchDelete: (ids: number[]): Promise<ApiResponse<null>> => {
    return http.post('/dns-records/batch-delete', { ids })
  }
}