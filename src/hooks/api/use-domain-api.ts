import { useState, useCallback } from 'react'
import { domainApi, mockDomainApi } from '@/lib/api/domain-api'
import type { 
  AdminUserDomainQueryRequest, 
  PaginatedResponse, 
  UserDomainInfo 
} from '@/types/domain'

// 是否使用模拟API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

// 域名列表查询钩子
export function useUserDomains() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<PaginatedResponse<UserDomainInfo> | null>(null)

  const fetchUserDomains = useCallback(async (params: AdminUserDomainQueryRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const api = USE_MOCK_API ? mockDomainApi : domainApi
      const response = await api.getUserDomains(params)
      
      if (response.code === 200) {
        setData(response.data)
      } else {
        setError(response.message || '获取域名列表失败')
      }
    } catch (err) {
      console.error('获取域名列表失败:', err)
      setError(err instanceof Error ? err.message : '网络请求失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback((params: AdminUserDomainQueryRequest) => {
    return fetchUserDomains(params)
  }, [fetchUserDomains])

  return {
    data,
    loading,
    error,
    fetchUserDomains,
    refresh
  }
}