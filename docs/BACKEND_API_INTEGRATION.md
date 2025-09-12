# 后端API对接说明文档

## 🎯 对接概述

本文档说明前端项目如何与后端API进行对接，包括配置方法、接口规范和测试验证。

## 🔧 配置说明

### 环境变量配置

项目支持通过环境变量灵活配置API对接方式：

#### 开发环境 (`.env.development`)
```env
# API配置
VITE_API_BASE_URL=http://localhost:8080/api/

# 是否使用模拟API (true: 使用模拟API, false: 使用真实后端API)
VITE_USE_MOCK_API=false

# 开发环境标识
VITE_NODE_ENV=development
```

#### 生产环境 (`.env.production`)
```env
# API配置
VITE_API_BASE_URL=http://localhost:8080/api/

# 是否使用模拟API (生产环境必须使用真实API)
VITE_USE_MOCK_API=false

# 生产环境标识
VITE_NODE_ENV=production
```

### API切换机制

项目实现了智能的API切换机制：

```typescript
// 是否使用模拟API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

export const adminApi = {
  login: (params: AdminLoginRequest) => {
    if (USE_MOCK_API) {
      console.log('🔄 使用模拟API进行登录')
      return mockAdminApi.login(params)
    }
    console.log('🌐 使用真实后端API进行登录')
    return http.post('/admin/login', params)
  }
}
```

## 📋 接口规范对接

### 后端API规范

根据 `rule/后端api接口文档/管理员登录接口.md` 文档：

- **接口路径**: `POST /api/admin/login`
- **Base URL**: `http://localhost:8080/api/`
- **Content-Type**: `application/json`
- **认证方式**: JWT Token

### 请求格式

```typescript
interface AdminLoginRequest {
  username: string;     // 管理员用户名，必填
  password: string;     // 管理员密码，必填
}
```

### 响应格式

```typescript
interface ApiResponse<T> {
  code: number;         // 业务状态码 (200=成功, 400=参数错误, 401=认证失败)
  message: string;      // 响应描述信息
  data: T;             // 响应数据
  timestamp: string;    // 服务器响应时间戳
}

interface AdminLoginResponse {
  admin: {
    id: number;
    username: string;
    email: string;
    role: string;
    createTime: string;
    updateTime: string;
  };
  token: string;        // JWT令牌
}
```

### 状态码处理

| 状态码 | 含义 | 前端处理 |
|--------|------|----------|
| 200 | 登录成功 | 保存token，跳转到登录后页面 |
| 400 | 参数错误 | 显示具体参数错误信息 |
| 401 | 认证失败 | 显示"用户名或密码错误" |
| 500 | 服务器错误 | 显示"系统繁忙，请稍后重试" |

## 🛠️ HTTP客户端配置

### Axios实例配置

```typescript
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 请求拦截器

自动添加JWT Token认证：

```typescript
http.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('admin_token')
  const userToken = localStorage.getItem('token')
  
  const token = adminToken || userToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 响应拦截器

统一处理API响应和错误：

```typescript
http.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === 200 || data.code === 201) {
      return data // 返回业务数据
    }
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error) => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 清除token并跳转登录页
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_info')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)
```

## 🧪 测试验证

### 内置测试工具

项目提供了内置的API测试工具，可以在登录页面右侧看到"后端API测试"面板：

1. **后端连接测试**: 测试与后端服务器的连接状态
2. **登录接口测试**: 测试管理员登录接口功能
3. **配置信息显示**: 显示当前API配置和模拟API状态

### 手动测试

#### 1. 测试后端连接

```bash
curl -X GET http://localhost:8080/api/health \
  -H "Content-Type: application/json"
```

#### 2. 测试登录接口

```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin"
  }'
```

#### 3. 测试认证接口

```bash
curl -X GET http://localhost:8080/api/admin/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 浏览器控制台测试

项目在浏览器控制台暴露了测试函数：

```javascript
// 测试后端连接
await testBackendConnection()

// 测试管理员登录
await testAdminLogin()
```

## 🚀 部署配置

### 开发环境启动

```bash
# 使用真实后端API
pnpm dev

# 使用模拟API（如果后端未启动）
VITE_USE_MOCK_API=true pnpm dev
```

### 生产环境构建

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### Docker部署配置

如果使用Docker部署，需要在容器中设置正确的环境变量：

```dockerfile
ENV VITE_API_BASE_URL=http://your-backend-server:8080/api/
ENV VITE_USE_MOCK_API=false
```

## 🔒 安全配置

### CORS配置

确保后端服务器配置了正确的CORS策略：

```java
@CrossOrigin(origins = {"http://localhost:5173", "http://your-frontend-domain"})
```

### JWT Token管理

- **存储**: Token存储在localStorage中
- **传输**: 通过Authorization头自动传输
- **过期**: Token过期时自动清除并跳转登录页
- **安全**: 登出时完整清除所有认证信息

## 📋 故障排查

### 常见问题

#### 1. 连接被拒绝 (Connection Refused)

**问题**: 无法连接到后端服务器
**解决方案**:
- 检查后端服务是否启动 (`http://localhost:8080`)
- 检查防火墙设置
- 确认API基础URL配置正确

#### 2. CORS错误

**问题**: 跨域请求被阻止
**解决方案**:
- 在后端配置CORS允许前端域名
- 检查请求头设置是否正确

#### 3. 401认证错误

**问题**: 请求返回401未授权
**解决方案**:
- 检查JWT Token是否正确传输
- 确认Token未过期
- 验证后端JWT验证逻辑

#### 4. 接口格式不匹配

**问题**: 响应格式与预期不符
**解决方案**:
- 对比接口文档确认响应格式
- 检查HTTP拦截器处理逻辑
- 验证TypeScript类型定义

### 调试技巧

1. **开启网络面板**: 在浏览器开发者工具中查看网络请求
2. **查看控制台日志**: API调用会输出详细日志
3. **使用测试工具**: 利用内置测试面板快速验证
4. **检查环境变量**: 确认API配置是否正确加载

## 📝 开发建议

### API开发最佳实践

1. **错误处理**: 始终处理API调用可能的错误情况
2. **加载状态**: 为API调用提供加载状态指示
3. **用户反馈**: 提供清晰的成功/失败反馈
4. **类型安全**: 使用TypeScript确保类型安全
5. **日志记录**: 记录关键API调用用于调试

### 性能优化

1. **请求缓存**: 对不常变化的数据进行缓存
2. **请求去重**: 避免重复的API调用
3. **超时处理**: 设置合理的请求超时时间
4. **错误重试**: 对网络错误实现自动重试机制

## 🔄 版本兼容性

### API版本管理

如果后端API有版本更新，可以通过环境变量配置：

```env
VITE_API_VERSION=v1
VITE_API_BASE_URL=http://localhost:8080/api/v1/
```

### 向后兼容

项目设计支持API版本的平滑升级：
- 保持响应格式的向后兼容
- 新增字段采用可选属性
- 废弃字段保留一定时间的兼容期

## 📞 技术支持

如果在API对接过程中遇到问题：

1. 查看本文档的故障排查部分
2. 检查后端API接口文档
3. 使用内置测试工具验证连接
4. 查看浏览器控制台和网络面板
5. 联系后端开发团队确认接口状态

---

**注意**: 本文档基于当前项目结构和后端API规范编写，如有变更请及时更新文档内容。