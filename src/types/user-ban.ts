/**
 * 用户封禁管理相关类型定义
 */

// 封禁用户请求参数
export interface BanUserRequest {
  userId: number
  banReason: string
}

// 解封用户请求参数
export interface UnbanUserRequest {
  userId: number
}

// 用户封禁详情
export interface UserBanDetails {
  id: number
  username: string
  email: string
  status: string
  isBanned: boolean
  banReason: string | null
  bannedBy: number | null
  banTime: string | null
}

// API响应格式
export interface BanUserResponse {
  code: number
  message: string
  data: string
  timestamp: string
}

export interface UnbanUserResponse {
  code: number
  message: string
  data: string
  timestamp: string
}

export interface BanStatusResponse {
  code: number
  message: string
  data: boolean
  timestamp: string
}

export interface BanDetailsResponse {
  code: number
  message: string
  data: UserBanDetails
  timestamp: string
}

// 封禁原因选项
export const BanReasonOptions = [
  { value: '违反用户协议', label: '违反用户协议' },
  { value: '恶意使用服务', label: '恶意使用服务' },
  { value: '发布违法内容', label: '发布违法内容' },
  { value: '恶意攻击系统', label: '恶意攻击系统' },
  { value: '频繁违规操作', label: '频繁违规操作' },
  { value: '其他原因', label: '其他原因' }
] as const