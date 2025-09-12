// 模拟管理员API服务
import type { AdminLoginRequest, AdminLoginResponse, Admin } from '@/types/admin'
import type { ApiResponse } from '@/types/api'

// 模拟管理员数据
const mockAdmin: Admin = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  role: 'ADMIN',
  createTime: new Date().toISOString(),
  updateTime: new Date().toISOString()
}

// 模拟JWT Token生成
const generateMockToken = (admin: Admin): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    sub: admin.id.toString(),
    email: admin.email,
    role: admin.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24小时后过期
  }))
  const signature = btoa('mock-signature')
  return `${header}.${payload}.${signature}`
}

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟管理员API
export const mockAdminApi = {
  // 模拟登录
  login: async (params: AdminLoginRequest): Promise<ApiResponse<AdminLoginResponse>> => {
    // 模拟网络延迟
    await delay(800)
    
    // 验证用户名和密码
    if (!params.username || !params.password) {
      throw new Error('用户名和密码不能为空')
    }
    
    if (params.username !== 'admin') {
      throw new Error('用户名或密码错误')
    }
    
    if (params.password !== 'admin') {
      throw new Error('用户名或密码错误')
    }
    
    // 生成响应数据
    const token = generateMockToken(mockAdmin)
    const response: ApiResponse<AdminLoginResponse> = {
      code: 200,
      message: '登录成功',
      data: {
        admin: mockAdmin,
        token
      },
      timestamp: new Date().toISOString()
    }
    
    return response
  },

  // 模拟获取管理员信息
  getAdminInfo: async (id: number): Promise<ApiResponse<Admin>> => {
    await delay(300)
    
    if (id !== 1) {
      throw new Error('管理员不存在')
    }
    
    return {
      code: 200,
      message: '获取成功',
      data: mockAdmin,
      timestamp: new Date().toISOString()
    }
  }
}