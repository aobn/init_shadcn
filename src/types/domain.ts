// 域名管理系统相关类型定义

// 用户类型
export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// 域名类型
export interface Domain {
  id: number
  name: string
  userId: number
  status: 'active' | 'inactive' | 'expired'
  registeredAt: string
  expiresAt: string
  autoRenew: boolean
  createdAt: string
  updatedAt: string
}

// DNS记录类型
export interface DnsRecord {
  id: number
  domainId: number
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV' | 'PTR'
  name: string
  value: string
  ttl: number
  priority?: number
  createdAt: string
  updatedAt: string
}

// 用户表单数据
export interface UserFormData {
  username: string
  email: string
  password?: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
}

// 域名表单数据
export interface DomainFormData {
  name: string
  userId: number
  autoRenew: boolean
  expiresAt: string
}

// DNS记录表单数据
export interface DnsRecordFormData {
  domainId: number
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV' | 'PTR'
  name: string
  value: string
  ttl: number
  priority?: number
}

// 分页查询参数
export interface QueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  type?: string
}

// 统计数据
export interface DashboardStats {
  totalUsers: number
  totalDomains: number
  totalDnsRecords: number
  activeDomains: number
  expiredDomains: number
  recentUsers: User[]
  recentDomains: Domain[]
}