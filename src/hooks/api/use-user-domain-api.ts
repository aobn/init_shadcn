/**
 * 用户域名管理API相关的React Hooks
 */
import { useState, useCallback } from 'react'
import { userDomainApi } from '@/lib/api/user-domain-api'
import type { AdminUserDomainQueryRequest, UserDomainInfo } from '@/types/user-domain'

// 用户域名列表Hook
export function useUserDomainList() {
  const [loading, setLoading] = useState(false)
  const [domains, setDomains] = useState<UserDomainInfo[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  })

  const fetchUserDomains = useCallback(async (params: AdminUserDomainQueryRequest) => {
    try {
      setLoading(true)
      console.log('发送用户域名API请求，参数:', params)
      const response = await userDomainApi.getUserDomains(params)
      console.log('用户域名API响应:', response)
      
      if (response.code === 200) {
        setDomains(response.data.content)
        setPagination({
          page: response.data.page,
          size: response.data.size,
          total: response.data.total,
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious
        })
      }
      
      return response
    } catch (error) {
      console.error('获取用户域名列表失败:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    domains,
    pagination,
    fetchUserDomains
  }
}