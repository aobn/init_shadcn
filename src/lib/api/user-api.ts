/**
 * 用户管理API服务
 */
import http from '@/lib/http'
import type { AdminUserQueryRequest, AdminUserQueryResponse } from '@/types/user'

export const userApi = {
  /**
   * 获取用户信息列表
   */
  getUsersInfo: async (params: AdminUserQueryRequest): Promise<AdminUserQueryResponse> => {
    return await http.post('/admin/users/info', params)
  }
}