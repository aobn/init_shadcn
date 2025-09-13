/**
 * DNS记录相关类型定义
 */

// DNS记录类型枚举
export const DnsRecordType = {
  A: 'A',
  AAAA: 'AAAA', 
  CNAME: 'CNAME',
  MX: 'MX',
  TXT: 'TXT',
  NS: 'NS',
  SRV: 'SRV',
  CAA: 'CAA'
} as const

export type DnsRecordTypeValue = typeof DnsRecordType[keyof typeof DnsRecordType]

// DNS记录状态枚举
export const DnsRecordStatus = {
  ENABLE: 'ENABLE',
  DISABLE: 'DISABLE'
} as const

export type DnsRecordStatusValue = typeof DnsRecordStatus[keyof typeof DnsRecordStatus]

// 同步状态枚举
export const SyncStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS', 
  FAILED: 'FAILED'
} as const

export type SyncStatusValue = typeof SyncStatus[keyof typeof SyncStatus]

// 用户DNS记录信息
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
  type: DnsRecordTypeValue
  value: string
  line: string
  lineId: string
  ttl: number
  mx: number | null
  weight: number | null
  status: DnsRecordStatusValue
  remark: string
  monitorStatus: string | null
  updatedOn: string
  syncStatus: SyncStatusValue
  syncError: string | null
  createTime: string
  updateTime: string
}

// DNS记录查询请求参数
export interface AdminDnsRecordQueryRequest {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
  keyword?: string
  userId?: number
  recordType?: DnsRecordTypeValue
  status?: DnsRecordStatusValue
  syncStatus?: SyncStatusValue
  domain?: string
}

// DNS记录查询响应
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

// 排序字段选项
export const SortByOptions = [
  { value: 'create_time', label: '创建时间' },
  { value: 'update_time', label: '更新时间' },
  { value: 'name', label: '主机记录' },
  { value: 'type', label: '记录类型' },
  { value: 'status', label: '记录状态' }
] as const

// 排序方向选项
export const SortDirOptions = [
  { value: 'DESC', label: '降序' },
  { value: 'ASC', label: '升序' }
] as const

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