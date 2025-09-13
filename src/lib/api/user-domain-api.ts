/**
 * 用户域名管理API服务
 */
import http from '@/lib/http'
import type { AdminUserDomainQueryRequest, AdminUserDomainResponse } from '@/types/user-domain'

export const userDomainApi = {
  /**
   * 获取用户域名列表
   */
  getUserDomains: async (params: AdminUserDomainQueryRequest): Promise<AdminUserDomainResponse> => {
    return await http.post('/admin/users/domains', params)
  }
}