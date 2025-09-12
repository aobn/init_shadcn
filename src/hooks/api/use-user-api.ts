import { useCallback } from 'react'
import { useApi } from './use-api'
import { userApi } from '@/lib/api/user-api'
import type { User, LoginParams, LoginResponse, RegisterParams } from '@/types/api'

// 用户登录钩子
export function useLogin() {
  const { execute, loading, error } = useApi<LoginResponse>()

  const login = useCallback(async (params: LoginParams) => {
    try {
      const data = await execute(() => userApi.login(params))
      // 登录成功后保存token
      if (data?.token) {
        localStorage.setItem('token', data.token)
      }
      return data
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }, [execute])

  return {
    login,
    loading,
    error,
  }
}

// 用户注册钩子
export function useRegister() {
  const { execute, loading, error } = useApi<User>()

  const register = useCallback(async (params: RegisterParams) => {
    return execute(() => userApi.register(params))
  }, [execute])

  return {
    register,
    loading,
    error,
  }
}

// 获取用户信息钩子
export function useUserInfo() {
  const { data, execute, loading, error, reset } = useApi<User>()

  const getUserInfo = useCallback(() => {
    return execute(() => userApi.getUserInfo())
  }, [execute])

  return {
    userInfo: data,
    getUserInfo,
    loading,
    error,
    reset,
  }
}

// 获取用户列表钩子
export function useUserList() {
  const { data, execute, loading, error, reset } = useApi<User[]>()

  const getUserList = useCallback((params?: { page?: number; pageSize?: number }) => {
    return execute(() => userApi.getUserList(params))
  }, [execute])

  return {
    userList: data,
    getUserList,
    loading,
    error,
    reset,
  }
}