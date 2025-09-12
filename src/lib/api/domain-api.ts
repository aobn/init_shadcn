import http from '@/lib/http'
import type { ApiResponse } from '@/types/api'
import type { 
  AdminUserDomainQueryRequest, 
  PaginatedResponse,
  UserDomainInfo
} from '@/types/domain'

// 域名相关API
export const domainApi = {
  // 管理员获取用户域名列表
  getUserDomains: (params: AdminUserDomainQueryRequest): Promise<ApiResponse<PaginatedResponse<UserDomainInfo>>> => {
    console.log('🌐 调用管理员获取用户域名接口', params)
    return http.post('/admin/users/domains', params)
  },
}

// 模拟域名API（开发时使用）
export const mockDomainApi = {
  // 模拟获取用户域名列表
  getUserDomains: async (params: AdminUserDomainQueryRequest): Promise<ApiResponse<PaginatedResponse<UserDomainInfo>>> => {
    console.log('🔄 使用模拟域名API', params)
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const mockDomains: UserDomainInfo[] = [
      {
        id: 1,
        userId: 123,
        username: 'testuser',
        email: 'test@example.com',
        subdomain: 'blog',
        domain: 'example.com',
        fullDomain: 'blog.example.com',
        status: 'ACTIVE',
        remark: '个人博客域名',
        createTime: '2025-09-13T10:30:00',
        updateTime: '2025-09-13T10:30:00'
      },
      {
        id: 2,
        userId: 124,
        username: 'user2',
        email: 'user2@example.com',
        subdomain: 'api',
        domain: 'example.com',
        fullDomain: 'api.example.com',
        status: 'ACTIVE',
        remark: 'API服务域名',
        createTime: '2025-09-13T11:00:00',
        updateTime: '2025-09-13T11:00:00'
      },
      {
        id: 3,
        userId: 125,
        username: 'developer',
        email: 'dev@example.com',
        subdomain: 'test',
        domain: 'testdomain.org',
        fullDomain: 'test.testdomain.org',
        status: 'INACTIVE',
        remark: '测试环境域名',
        createTime: '2025-09-12T15:20:00',
        updateTime: '2025-09-13T09:15:00'
      },
      {
        id: 4,
        userId: 126,
        username: 'admin',
        email: 'admin@example.com',
        subdomain: 'www',
        domain: 'mysite.net',
        fullDomain: 'www.mysite.net',
        status: 'ACTIVE',
        remark: '主站域名',
        createTime: '2025-09-10T08:45:00',
        updateTime: '2025-09-13T12:30:00'
      },
      {
        id: 5,
        userId: 127,
        username: 'guest',
        email: 'guest@example.com',
        subdomain: 'demo',
        domain: 'example.com',
        fullDomain: 'demo.example.com',
        status: 'DELETED',
        remark: '演示域名（已删除）',
        createTime: '2025-09-08T14:10:00',
        updateTime: '2025-09-11T16:20:00'
      }
    ]
    
    // 应用搜索过滤
    let filteredDomains = mockDomains
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredDomains = mockDomains.filter(domain => 
        domain.username.toLowerCase().includes(keyword) ||
        domain.email.toLowerCase().includes(keyword) ||
        domain.subdomain.toLowerCase().includes(keyword) ||
        domain.domain.toLowerCase().includes(keyword) ||
        domain.fullDomain.toLowerCase().includes(keyword)
      )
    }
    
    // 应用状态过滤
    if (params.status) {
      filteredDomains = filteredDomains.filter(domain => domain.status === params.status)
    }
    
    // 应用用户ID过滤
    if (params.userId) {
      filteredDomains = filteredDomains.filter(domain => domain.userId === params.userId)
    }
    
    // 应用域名过滤
    if (params.domain) {
      filteredDomains = filteredDomains.filter(domain => domain.domain === params.domain)
    }
    
    // 排序
    const sortBy = params.sortBy || 'create_time'
    const sortDir = params.sortDir || 'DESC'
    filteredDomains.sort((a, b) => {
      let aValue: any, bValue: any
      switch (sortBy) {
        case 'create_time':
          aValue = new Date(a.createTime).getTime()
          bValue = new Date(b.createTime).getTime()
          break
        case 'update_time':
          aValue = new Date(a.updateTime).getTime()
          bValue = new Date(b.updateTime).getTime()
          break
        case 'full_domain':
          aValue = a.fullDomain
          bValue = b.fullDomain
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = a.createTime
          bValue = b.createTime
      }
      
      if (sortDir === 'ASC') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    // 分页
    const page = params.page || 1
    const size = Math.min(Math.max(params.size || 20, 20), 3000)
    const startIndex = (page - 1) * size
    const endIndex = startIndex + size
    const paginatedDomains = filteredDomains.slice(startIndex, endIndex)
    
    const total = filteredDomains.length
    const totalPages = Math.ceil(total / size)
    
    return {
      code: 200,
      message: '获取用户域名列表成功',
      data: {
        content: paginatedDomains,
        page,
        size,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      },
      timestamp: new Date().toISOString()
    }
  }
}