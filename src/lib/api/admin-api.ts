import http from '@/lib/http'
import type { ApiResponse } from '@/types/api'
import type { AdminLoginRequest, AdminLoginResponse } from '@/types/admin'

// 管理员相关API
export const adminApi = {
  // 管理员登录
  login: (params: AdminLoginRequest): Promise<ApiResponse<AdminLoginResponse>> => {
    return http.post('/admin/login', params)
  },

  // 获取管理员信息（需要认证）
  getAdminInfo: (id: number): Promise<ApiResponse<AdminLoginResponse['admin']>> => {
    return http.get(`/admin/${id}`)
  },

  // 登出（清除本地token）
  logout: (): void => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
  },
}