/**
 * 用户DNS记录管理API相关的React Hooks
 */
import { useState, useCallback } from 'react'
import { userDnsRecordApi } from '@/lib/api/user-dns-record-api'
import type { AdminDnsRecordQueryRequest, UserDnsRecordInfo } from '@/types/user-dns-record'

// 用户DNS记录列表Hook
export function useUserDnsRecordList() {
  const [loading, setLoading] = useState(false)
  const [dnsRecords, setDnsRecords] = useState<UserDnsRecordInfo[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false
  })

  const fetchUserDnsRecords = useCallback(async (params: AdminDnsRecordQueryRequest) => {
    try {
      setLoading(true)
      console.log('发送用户DNS记录API请求，参数:', params)
      const response = await userDnsRecordApi.getUserDnsRecords(params)
      console.log('用户DNS记录API响应:', response)
      
      if (response.code === 200) {
        setDnsRecords(response.data.content)
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
      console.error('获取用户DNS记录列表失败:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    dnsRecords,
    pagination,
    fetchUserDnsRecords
  }
}