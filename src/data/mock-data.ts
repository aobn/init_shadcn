// 模拟数据文件
import type { User, Domain, DnsRecord } from '@/types/domain'

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 2,
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-10T10:30:00Z',
    updatedAt: '2024-02-10T10:30:00Z'
  },
  {
    id: 3,
    username: 'jane_smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-03-05T14:20:00Z',
    updatedAt: '2024-03-05T14:20:00Z'
  },
  {
    id: 4,
    username: 'bob_wilson',
    email: 'bob@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-03-20T09:15:00Z',
    updatedAt: '2024-03-20T09:15:00Z'
  },
  {
    id: 5,
    username: 'alice_brown',
    email: 'alice@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-04-01T16:45:00Z',
    updatedAt: '2024-04-01T16:45:00Z'
  }
]

// 模拟域名数据
export const mockDomains: Domain[] = [
  {
    id: 1,
    name: 'example.com',
    userId: 2,
    status: 'active',
    autoRenew: true,
    registeredAt: '2023-01-15T08:00:00Z',
    expiresAt: '2025-01-15T08:00:00Z',
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 2,
    name: 'mysite.org',
    userId: 3,
    status: 'active',
    autoRenew: false,
    registeredAt: '2023-06-10T10:30:00Z',
    expiresAt: '2024-12-10T10:30:00Z',
    createdAt: '2023-06-10T10:30:00Z',
    updatedAt: '2024-06-10T10:30:00Z'
  },
  {
    id: 3,
    name: 'testdomain.net',
    userId: 4,
    status: 'expired',
    autoRenew: false,
    registeredAt: '2022-03-05T14:20:00Z',
    expiresAt: '2024-03-05T14:20:00Z',
    createdAt: '2022-03-05T14:20:00Z',
    updatedAt: '2024-03-05T14:20:00Z'
  },
  {
    id: 4,
    name: 'newproject.io',
    userId: 5,
    status: 'active',
    autoRenew: true,
    registeredAt: '2024-02-20T09:15:00Z',
    expiresAt: '2026-02-20T09:15:00Z',
    createdAt: '2024-02-20T09:15:00Z',
    updatedAt: '2024-02-20T09:15:00Z'
  },
  {
    id: 5,
    name: 'portfolio.dev',
    userId: 2,
    status: 'inactive',
    autoRenew: false,
    registeredAt: '2023-11-01T16:45:00Z',
    expiresAt: '2025-11-01T16:45:00Z',
    createdAt: '2023-11-01T16:45:00Z',
    updatedAt: '2024-11-01T16:45:00Z'
  }
]

// 模拟DNS记录数据
export const mockDnsRecords: DnsRecord[] = [
  {
    id: 1,
    domainId: 1,
    type: 'A',
    name: '@',
    value: '192.168.1.100',
    ttl: 300,
    priority: undefined,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 2,
    domainId: 1,
    type: 'CNAME',
    name: 'www',
    value: 'example.com',
    ttl: 300,
    priority: undefined,
    createdAt: '2024-01-15T08:05:00Z',
    updatedAt: '2024-01-15T08:05:00Z'
  },
  {
    id: 3,
    domainId: 1,
    type: 'MX',
    name: '@',
    value: 'mail.example.com',
    ttl: 3600,
    priority: 10,
    createdAt: '2024-01-15T08:10:00Z',
    updatedAt: '2024-01-15T08:10:00Z'
  },
  {
    id: 4,
    domainId: 2,
    type: 'A',
    name: '@',
    value: '203.0.113.50',
    ttl: 600,
    priority: undefined,
    createdAt: '2024-06-10T10:30:00Z',
    updatedAt: '2024-06-10T10:30:00Z'
  },
  {
    id: 5,
    domainId: 2,
    type: 'TXT',
    name: '@',
    value: 'v=spf1 include:_spf.google.com ~all',
    ttl: 3600,
    priority: undefined,
    createdAt: '2024-06-10T10:35:00Z',
    updatedAt: '2024-06-10T10:35:00Z'
  },
  {
    id: 6,
    domainId: 4,
    type: 'AAAA',
    name: '@',
    value: '2001:db8::1',
    ttl: 300,
    priority: undefined,
    createdAt: '2024-02-20T09:15:00Z',
    updatedAt: '2024-02-20T09:15:00Z'
  },
  {
    id: 7,
    domainId: 4,
    type: 'NS',
    name: '@',
    value: 'ns1.example.com',
    ttl: 86400,
    priority: undefined,
    createdAt: '2024-02-20T09:20:00Z',
    updatedAt: '2024-02-20T09:20:00Z'
  }
]

// 模拟仪表板统计数据
export const mockDashboardStats = {
  totalUsers: mockUsers.length,
  activeUsers: mockUsers.filter(u => u.status === 'active').length,
  totalDomains: mockDomains.length,
  activeDomains: mockDomains.filter(d => d.status === 'active').length,
  expiredDomains: mockDomains.filter(d => d.status === 'expired').length,
  totalDnsRecords: mockDnsRecords.length,
  recentUsers: mockUsers.slice(-3),
  recentDomains: mockDomains.slice(-3),
  expiringDomains: mockDomains.filter(d => {
    const expiryDate = new Date(d.expiresAt)
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    return expiryDate <= thirtyDaysFromNow && d.status === 'active'
  })
}

// 模拟API延迟
export const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))