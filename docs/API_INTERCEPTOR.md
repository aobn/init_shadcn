# API响应拦截器使用指南

## 概述

本项目实现了统一的API响应拦截器，基于axios库构建，遵循项目的API接口规范，提供了完整的错误处理和状态管理功能。

## 核心文件

### 1. HTTP客户端 (`src/lib/http.ts`)

统一的axios实例配置，包含请求和响应拦截器：

```typescript
import http from '@/lib/http'

// 基础配置
- baseURL: 'http://localhost:8080/api/'
- timeout: 10000ms
- Content-Type: 'application/json'
```

### 2. API类型定义 (`src/types/api.ts`)

定义了统一的API响应格式和相关类型：

```typescript
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: string
}
```

### 3. API钩子 (`src/hooks/api/use-api.ts`)

提供了通用的API请求状态管理钩子。

## 功能特性

### 请求拦截器

- **自动添加认证**: 从localStorage获取token并添加到请求头
- **统一请求格式**: 设置Content-Type为application/json

### 响应拦截器

- **统一响应处理**: 自动解析API响应格式
- **业务状态码处理**: 处理200/201成功状态
- **HTTP错误处理**: 
  - 400: 请求参数错误
  - 401: 未授权，自动清除token并跳转登录
  - 403: 禁止访问
  - 404: 资源不存在
  - 409: 资源冲突
  - 423: 账户锁定
  - 500: 服务器内部错误

## 使用方法

### 1. 创建API服务

```typescript
// src/lib/api/user-api.ts
import http from '@/lib/http'
import type { ApiResponse, User } from '@/types/api'

export const userApi = {
  getUserInfo: (): Promise<ApiResponse<User>> => {
    return http.get('/user/info')
  },
  
  login: (params: LoginParams): Promise<ApiResponse<LoginResponse>> => {
    return http.post('/auth/login', params)
  }
}
```

### 2. 使用API钩子

```typescript
// 在组件中使用
import { useUserInfo } from '@/hooks/api/use-user-api'

function UserProfile() {
  const { userInfo, getUserInfo, loading, error } = useUserInfo()
  
  useEffect(() => {
    getUserInfo()
  }, [])
  
  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>
  
  return <div>用户: {userInfo?.username}</div>
}
```

### 3. 直接使用HTTP客户端

```typescript
import http from '@/lib/http'

// GET请求
const response = await http.get('/users')

// POST请求
const response = await http.post('/users', userData)

// PUT请求
const response = await http.put('/users/1', updateData)

// DELETE请求
const response = await http.delete('/users/1')
```

## 错误处理

### 自动处理的错误

1. **网络错误**: 自动提示"网络错误，请检查网络连接"
2. **401未授权**: 自动清除token并跳转到登录页
3. **服务器错误**: 统一提示"系统繁忙，请稍后重试"

### 自定义错误处理

```typescript
try {
  const data = await userApi.getUserInfo()
  // 处理成功响应
} catch (error) {
  // 处理错误
  console.error('获取用户信息失败:', error.message)
}
```

## 最佳实践

### 1. API服务组织

- 按功能模块组织API服务文件
- 使用TypeScript类型确保类型安全
- 统一使用Promise<ApiResponse<T>>返回类型

### 2. 钩子使用

- 为每个API服务创建对应的钩子
- 使用useApi钩子管理请求状态
- 在钩子中处理业务逻辑（如token保存）

### 3. 错误处理

- 在组件中展示用户友好的错误信息
- 使用try-catch处理特定的业务错误
- 避免在拦截器中处理业务特定的错误

## 演示页面

访问 `/api-demo` 路由可以查看完整的API拦截器演示，包括：

- 用户登录演示
- 获取用户信息演示
- 获取用户列表演示
- 错误处理演示

## 配置说明

### 修改基础URL

在 `src/lib/http.ts` 中修改 `baseURL`：

```typescript
const http = axios.create({
  baseURL: 'https://your-api-domain.com/api/',
  // ...其他配置
})
```

### 修改超时时间

```typescript
const http = axios.create({
  timeout: 15000, // 15秒
  // ...其他配置
})
```

### 自定义请求头

```typescript
// 在请求拦截器中添加
http.interceptors.request.use((config) => {
  config.headers['Custom-Header'] = 'value'
  return config
})