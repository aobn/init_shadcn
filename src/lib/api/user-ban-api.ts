/**
 * 用户封禁管理API服务
 */
import http from '@/lib/http'
import type { 
  BanUserRequest, 
  UnbanUserRequest,
  BanUserResponse,
  UnbanUserResponse,
  BanStatusResponse,
  BanDetailsResponse
} from '@/types/user-ban'

export const userBanApi = {
  /**
   * 封禁用户
   */
  banUser: async (params: BanUserRequest): Promise<BanUserResponse> => {
    return await http.post('/admin/users/ban', params)
  },

  /**
   * 解封用户
   */
  unbanUser: async (params: UnbanUserRequest): Promise<UnbanUserResponse> => {
    return await http.post('/admin/users/unban', params)
  },

  /**
   * 检查用户封禁状态
   */
  getBanStatus: async (userId: number): Promise<BanStatusResponse> => {
    return await http.get(`/admin/users/${userId}/ban-status`)
  },

  /**
   * 获取用户封禁详情
   */
  getBanDetails: async (userId: number): Promise<BanDetailsResponse> => {
    return await http.get(`/admin/users/${userId}/ban-details`)
  }
}