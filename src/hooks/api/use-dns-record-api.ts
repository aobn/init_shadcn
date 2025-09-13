/**
 * DNS记录API相关的React Hooks
 */
import { useState, useCallback } from 'react'
import { dnsRecordApi } from '@/lib/api/dns-record-api'
import type { AdminDnsRecordQueryRequest, UserDnsRecordInfo } from '@/types/dns-record'

// DNS记录列表Hook
export function useDnsRecordList() {
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

  const fetchDnsRecords = useCallback(async (params: AdminDnsRecordQueryRequest) => {
    try {
      setLoading(true)
      const response = await dnsRecordApi.getUserDnsRecords(params)
      
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
      console.error('获取DNS记录列表失败:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    dnsRecords,
    pagination,
    fetchDnsRecords
  }
}