/**
 * 用户管理API相关的React Hooks
 */
import { useState, useCallback } from 'react'
import { userApi } from '@/lib/api/user-api'
import type { AdminUserQueryRequest, UserInfo } from '@/types/user'

// 用户列表Hook
export function useUserList() {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<UserInfo[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    total: 0,
    totalPages: 0,
    first: true,
    last: false,
    hasNext: false,
    hasPrevious: false
  })

  const fetchUsers = useCallback(async (params: AdminUserQueryRequest) => {
    try {
      setLoading(true)
      console.log('发送API请求，参数:', params)
      const response = await userApi.getUsersInfo(params)
      console.log('API响应:', response)
      
      if (response.code === 200) {
        setUsers(response.data.content)
        setPagination({
          page: response.data.page,
          size: response.data.size,
          total: response.data.total,
          totalPages: response.data.totalPages,
          first: response.data.first,
          last: response.data.last,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious
        })
      }
      
      return response
    } catch (error) {
      console.error('获取用户列表失败:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    users,
    pagination,
    fetchUsers
  }
}