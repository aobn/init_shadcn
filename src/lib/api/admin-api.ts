import http from '@/lib/http'
import { mockAdminApi } from '@/lib/mock-admin-api'
import type { ApiResponse } from '@/types/api'
import type { AdminLoginRequest, AdminLoginResponse } from '@/types/admin'

// 是否使用模拟API
// 可以通过环境变量 VITE_USE_MOCK_API 控制，默认在开发环境使用真实API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

// 管理员相关API
export const adminApi = {
  // 管理员登录
  login: (params: AdminLoginRequest): Promise<ApiResponse<AdminLoginResponse>> => {
    if (USE_MOCK_API) {
      console.log('🔄 使用模拟API进行登录')
      return mockAdminApi.login(params)
    }
    console.log('🌐 使用真实后端API进行登录')
    return http.post('/admin/login', params)
  },

  // 获取管理员信息（需要认证）
  getAdminInfo: (id: number): Promise<ApiResponse<AdminLoginResponse['admin']>> => {
    if (USE_MOCK_API) {
      return mockAdminApi.getAdminInfo(id)
    }
    return http.get(`/admin/${id}`)
  },

  // 登出（清除本地token）
  logout: (): void => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
  },
}