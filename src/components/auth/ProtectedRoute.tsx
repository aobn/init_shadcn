// 受保护的路由组件
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminStore } from '@/store/admin-store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * 受保护的路由组件
 * 检查用户是否已登录，未登录则重定向到登录页
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, token } = useAdminStore()
  const location = useLocation()

  // 检查认证状态
  const isLoggedIn = isAuthenticated && token

  // 如果未登录，重定向到登录页面，并保存当前路径
  if (!isLoggedIn) {
    console.log('用户未登录，重定向到登录页面')
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
}