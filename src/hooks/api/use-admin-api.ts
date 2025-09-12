import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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
      const response = await execute(() => adminApi.login(params))
      
      if (response) {
        // 保存管理员信息和token到localStorage
        localStorage.setItem('admin_token', response.token)
        localStorage.setItem('admin_info', JSON.stringify(response.admin))
        
        // 更新全局状态
        setAdmin(response.admin)
        setToken(response.token)
        setAuthenticated(true)
        
        console.log('管理员登录成功:', response.admin.username)
      }
      
      return response
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
  const navigate = useNavigate()

  const logout = useCallback(async () => {
    try {
      // 清除API中的token和本地存储
      adminApi.logout()
      
      // 清除全局状态
      clearAdmin()
      
      console.log('管理员已登出')
      
      // 跳转到登录页面
      navigate('/', { replace: true })
    } catch (error) {
      console.error('登出过程中发生错误:', error)
      // 即使出错也要清除状态并跳转
      clearAdmin()
      navigate('/', { replace: true })
    }
  }, [clearAdmin, navigate])

  return {
    logout,
  }
}