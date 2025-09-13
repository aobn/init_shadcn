/**
 * 用户DNS记录管理API服务
 */
import http from '@/lib/http'
import type { AdminDnsRecordQueryRequest, AdminDnsRecordResponse } from '@/types/user-dns-record'

export const userDnsRecordApi = {
  /**
   * 获取用户DNS记录列表
   */
  getUserDnsRecords: async (params: AdminDnsRecordQueryRequest): Promise<AdminDnsRecordResponse> => {
    return await http.post('/admin/users/dns-records', params)
  }
}