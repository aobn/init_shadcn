/**
 * 用户封禁管理API相关的React Hooks
 */
import { useState, useCallback } from 'react'
import { userBanApi } from '@/lib/api/user-ban-api'
import type { BanUserRequest, UnbanUserRequest, UserBanDetails } from '@/types/user-ban'

export function useUserBan() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 封禁用户
  const banUser = useCallback(async (params: BanUserRequest): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('封禁用户参数:', params)
      
      const response = await userBanApi.banUser(params)
      
      console.log('封禁用户响应:', response)
      
      if (response.code === 200) {
        return true
      } else {
        setError(response.message || '封禁用户失败')
        return false
      }
    } catch (err: any) {
      console.error('封禁用户错误:', err)
      setError(err.message || '封禁用户失败')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // 解封用户
  const unbanUser = useCallback(async (params: UnbanUserRequest): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('解封用户参数:', params)
      
      const response = await userBanApi.unbanUser(params)
      
      console.log('解封用户响应:', response)
      
      if (response.code === 200) {
        return true
      } else {
        setError(response.message || '解封用户失败')
        return false
      }
    } catch (err: any) {
      console.error('解封用户错误:', err)
      setError(err.message || '解封用户失败')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    banUser,
    unbanUser
  }
}

export function useUserBanDetails() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [banDetails, setBanDetails] = useState<UserBanDetails | null>(null)

  // 获取用户封禁详情
  const fetchBanDetails = useCallback(async (userId: number): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('获取用户封禁详情参数:', { userId })
      
      const response = await userBanApi.getBanDetails(userId)
      
      console.log('获取用户封禁详情响应:', response)
      
      if (response.code === 200) {
        setBanDetails(response.data)
      } else {
        setError(response.message || '获取封禁详情失败')
        setBanDetails(null)
      }
    } catch (err: any) {
      console.error('获取用户封禁详情错误:', err)
      setError(err.message || '获取封禁详情失败')
      setBanDetails(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // 检查用户封禁状态
  const checkBanStatus = useCallback(async (userId: number): Promise<boolean | null> => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('检查用户封禁状态参数:', { userId })
      
      const response = await userBanApi.getBanStatus(userId)
      
      console.log('检查用户封禁状态响应:', response)
      
      if (response.code === 200) {
        return response.data
      } else {
        setError(response.message || '检查封禁状态失败')
        return null
      }
    } catch (err: any) {
      console.error('检查用户封禁状态错误:', err)
      setError(err.message || '检查封禁状态失败')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    banDetails,
    fetchBanDetails,
    checkBanStatus
  }
}