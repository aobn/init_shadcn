import { useState, useCallback } from 'react'
import type { ApiResponse } from '@/types/api'

// API请求状态
export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// API请求钩子
export function useApi<T = unknown>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  // 执行API请求
  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiCall()
      setState({
        data: response.data,
        loading: false,
        error: null,
      })
      return response.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '请求失败'
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      })
      throw error
    }
  }, [])

  // 重置状态
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}