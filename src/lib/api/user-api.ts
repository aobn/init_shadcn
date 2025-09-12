import http from '@/lib/http'
import type { ApiResponse, User, LoginParams, LoginResponse, RegisterParams } from '@/types/api'

// 用户相关API
export const userApi = {
  // 用户登录
  login: (params: LoginParams): Promise<ApiResponse<LoginResponse>> => {
    return http.post('/auth/login', params)
  },

  // 用户注册
  register: (params: RegisterParams): Promise<ApiResponse<User>> => {
    return http.post('/auth/register', params)
  },

  // 获取用户信息
  getUserInfo: (): Promise<ApiResponse<User>> => {
    return http.get('/user/info')
  },

  // 获取用户列表
  getUserList: (params?: { page?: number; pageSize?: number }): Promise<ApiResponse<User[]>> => {
    return http.get('/users', { params })
  },

  // 更新用户信息
  updateUser: (id: number, data: Partial<User>): Promise<ApiResponse<User>> => {
    return http.put(`/users/${id}`, data)
  },

  // 删除用户
  deleteUser: (id: number): Promise<ApiResponse<null>> => {
    return http.delete(`/users/${id}`)
  },
}