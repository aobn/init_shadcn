// API测试工具
import { adminApi } from '@/lib/api/admin-api'

// 测试管理员登录接口
export const testAdminLogin = async () => {
  console.log('🧪 开始测试管理员登录接口...')
  
  try {
    const response = await adminApi.login({
      username: 'admin',
      password: 'admin'
    })
    
    console.log('✅ 登录测试成功:', response)
    return response
  } catch (error) {
    console.error('❌ 登录测试失败:', error)
    throw error
  }
}

// 测试后端连接
export const testBackendConnection = async () => {
  console.log('🔗 测试后端连接...')
  
  try {
    // 尝试访问一个简单的接口来测试连接
    const response = await fetch('http://localhost:8080/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ 后端连接成功:', data)
      return true
    } else {
      console.warn('⚠️ 后端响应异常:', response.status, response.statusText)
      return false
    }
  } catch (error) {
    console.error('❌ 后端连接失败:', error)
    return false
  }
}

// 在浏览器控制台中暴露测试函数
if (typeof window !== 'undefined') {
  ;(window as any).testAdminLogin = testAdminLogin
  ;(window as any).testBackendConnection = testBackendConnection
}