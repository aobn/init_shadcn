import { useCallback } from 'react'
import { useApi } from './use-api'
import { adminApi } from '@/lib/api/admin-api'
import { useAdminStore } from '@/store/admin-store'
import type { AdminLoginRequest, AdminLoginResponse } from '@/types/admin'

// 管理员登录钩子
export function useAdminLogin() {
  const { execute, loading, error } = useApi<AdminLoginResponse>()
  const { setAdmin, setToken, setAuthenticated } = useAdminStore()

  const login = useCallback(async (params: AdminLoginRequest) => {
    try {
      const data = await execute(() => adminApi.login(params))
      
      if (data) {
        // 保存管理员信息和token到localStorage
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_info', JSON.stringify(data.admin))
        
        // 更新全局状态
        setAdmin(data.admin)
        setToken(data.token)
        setAuthenticated(true)
        
        console.log('管理员登录成功:', data.admin.username)
      }
      
      return data
    } catch (error) {
      console.error('管理员登录失败:', error)
      throw error
    }
  }, [execute, setAdmin, setToken, setAuthenticated])

  return {
    login,
    loading,
    error,
  }
}

// 管理员登出钩子
export function useAdminLogout() {
  const { clearAdmin } = useAdminStore()

  const logout = useCallback(() => {
    // 清除API中的token
    adminApi.logout()
    
    // 清除全局状态
    clearAdmin()
    
    console.log('管理员已登出')
  }, [clearAdmin])

  return {
    logout,
  }
}