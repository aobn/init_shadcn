import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAdminStore } from '@/store/admin-store'
import { useAdminLogout } from '@/hooks/api/use-admin-api'

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { admin, isAuthenticated, initializeFromStorage } = useAdminStore()
  const { logout } = useAdminLogout()

  // 初始化时检查认证状态
  useEffect(() => {
    initializeFromStorage()
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate, initializeFromStorage])

  // 处理登出
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">管理员仪表板</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">欢迎,</span>
              <span className="font-medium">{admin.username}</span>
              <Badge variant="secondary">{admin.role}</Badge>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              登出
            </Button>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 管理员信息卡片 */}
          <Card>
            <CardHeader>
              <CardTitle>管理员信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span>{admin.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">用户名:</span>
                <span>{admin.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">邮箱:</span>
                <span>{admin.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">角色:</span>
                <Badge variant="secondary">{admin.role}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">创建时间:</span>
                <span className="text-sm">
                  {new Date(admin.createTime).toLocaleString('zh-CN')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 系统状态卡片 */}
          <Card>
            <CardHeader>
              <CardTitle>系统状态</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">登录状态:</span>
                <Badge variant="default">已登录</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Token状态:</span>
                <Badge variant="secondary">有效</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">权限级别:</span>
                <Badge variant="outline">管理员</Badge>
              </div>
            </CardContent>
          </Card>

          {/* 快速操作卡片 */}
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                用户管理
              </Button>
              <Button className="w-full" variant="outline">
                系统设置
              </Button>
              <Button className="w-full" variant="outline">
                数据统计
              </Button>
              <Button className="w-full" variant="outline">
                日志查看
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* API测试区域 */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>API接口测试</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">登录接口信息</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p><strong>接口路径:</strong> POST /api/admin/login</p>
                    <p><strong>认证方式:</strong> JWT Token</p>
                    <p><strong>Token有效期:</strong> 24小时</p>
                    <p><strong>当前状态:</strong> 已认证</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">响应拦截器功能</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>✅ 自动token认证</p>
                    <p>✅ 统一错误处理</p>
                    <p>✅ 401自动跳转登录</p>
                    <p>✅ 响应格式标准化</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard