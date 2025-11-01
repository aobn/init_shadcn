import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'

// API响应接口定义
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: string
}

// 创建axios实例
const http = axios.create({
  baseURL: 'http://db.webdom2.goxi.top/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 添加token认证信息，优先使用管理员token
    const adminToken = localStorage.getItem('admin_token')
    const userToken = localStorage.getItem('token')
    
    const token = adminToken || userToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const { data } = response
    
    // 检查业务状态码
    if (data.code === 200 || data.code === 201) {
      // 返回业务数据，这样API调用者可以直接获取data字段
      return data as ApiResponse<unknown>
    }
    
    // 处理业务错误
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error: AxiosError<ApiResponse>) => {
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          console.error('请求参数错误:', data?.message)
          break
        case 401:
          console.error('未授权，请重新登录')
          // 清除本地token并跳转到登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          console.error('禁止访问:', data?.message)
          break
        case 404:
          console.error('请求的资源不存在:', data?.message)
          break
        case 409:
          console.error('资源冲突:', data?.message)
          break
        case 423:
          console.error('账户已锁定:', data?.message)
          break
        case 500:
          console.error('服务器内部错误')
          break
        default:
          console.error('请求失败:', data?.message || error.message)
      }
      
      return Promise.reject(new Error(data?.message || '请求失败'))
    } else if (error.request) {
      console.error('网络错误，请检查网络连接')
      return Promise.reject(new Error('网络错误，请检查网络连接'))
    } else {
      console.error('请求配置错误:', error.message)
      return Promise.reject(error)
    }
  }
)

export default http
