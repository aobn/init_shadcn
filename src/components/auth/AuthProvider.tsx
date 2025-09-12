// 认证提供者组件
import { useEffect, useState } from 'react'
import { useAdminStore } from '@/store/admin-store'

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * 认证提供者组件
 * 负责在应用启动时检查和恢复登录状态
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const initializeFromStorage = useAdminStore(state => state.initializeFromStorage)

  useEffect(() => {
    // 从localStorage恢复登录状态
    initializeFromStorage()
    setIsInitialized(true)
  }, []) // 移除依赖项，只在组件挂载时执行一次

  // 在初始化完成前显示加载状态
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">正在加载...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}