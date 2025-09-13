/**
 * 用户DNS记录管理相关类型定义
 */

// 用户DNS记录信息接口
export interface UserDnsRecordInfo {
  id: number
  userId: number
  username: string
  email: string
  subdomainId: number
  subdomain: string
  domain: string
  fullDomain: string
  recordId: number
  name: string
  type: string
  value: string
  line: string
  lineId: string
  ttl: number
  mx: number | null
  weight: number | null
  status: string
  remark: string
  monitorStatus: string | null
  updatedOn: string
  syncStatus: string
  syncError: string | null
  createTime: string
  updateTime: string
}

// 用户DNS记录查询请求参数
export interface AdminDnsRecordQueryRequest {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  keyword?: string
  userId?: number
  recordType?: string
  status?: string
  syncStatus?: string
}

// 用户DNS记录查询响应
export interface AdminDnsRecordResponse {
  code: number
  message: string
  data: {
    content: UserDnsRecordInfo[]
    page: number
    size: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
  timestamp: string
}

// DNS记录类型选项
export const DnsRecordTypeOptions = [
  { value: 'A', label: 'A记录' },
  { value: 'AAAA', label: 'AAAA记录' },
  { value: 'CNAME', label: 'CNAME记录' },
  { value: 'MX', label: 'MX记录' },
  { value: 'TXT', label: 'TXT记录' },
  { value: 'NS', label: 'NS记录' },
  { value: 'SRV', label: 'SRV记录' },
  { value: 'CAA', label: 'CAA记录' }
] as const

// DNS记录状态选项
export const DnsRecordStatusOptions = [
  { value: 'ENABLE', label: '启用' },
  { value: 'DISABLE', label: '禁用' }
] as const

// 同步状态选项
export const SyncStatusOptions = [
  { value: 'PENDING', label: '待同步' },
  { value: 'SUCCESS', label: '同步成功' },
  { value: 'FAILED', label: '同步失败' }
] as const

// 排序字段选项
export const DnsRecordSortByOptions = [
  { value: 'create_time', label: '创建时间' },
  { value: 'update_time', label: '更新时间' },
  { value: 'name', label: '主机记录' },
  { value: 'type', label: '记录类型' },
  { value: 'status', label: '记录状态' }
] as const