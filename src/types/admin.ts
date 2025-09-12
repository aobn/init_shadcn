// 管理员相关类型定义

// 管理员信息
export interface Admin {
  id: number
  username: string
  email: string
  role: string
  createTime: string
  updateTime: string
}

// 管理员登录请求参数
export interface AdminLoginRequest {
  username: string
  password: string
}

// 管理员登录响应数据
export interface AdminLoginResponse {
  admin: Admin
  token: string
}

// 管理员状态
export interface AdminState {
  admin: Admin | null
  token: string | null
  isAuthenticated: boolean
}