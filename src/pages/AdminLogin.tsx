import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAdminLogin } from '@/hooks/api/use-admin-api'
import { useAdminStore } from '@/store/admin-store'

const AdminLogin: React.FC = () => {
  const { login, loading, error } = useAdminLogin()
  const { initializeFromStorage } = useAdminStore()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  // 初始化时检查是否已登录
  useEffect(() => {
    initializeFromStorage()
    // 如果已登录，显示登录状态（不跳转，因为dashboard页面已删除）
  }, [initializeFromStorage])

  // 处理表单输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 处理登录提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.username.trim()) {
      return
    }
    
    if (!formData.password.trim()) {
      return
    }

    try {
      await login(formData)
      // 登录成功提示（dashboard页面已删除）
      alert('登录成功！')
    } catch (error) {
      // 错误已经在钩子中处理
      console.error('登录失败:', error)
    }
  }

  // 使用测试账号快速登录
  const handleTestLogin = () => {
    setFormData({
      username: 'admin',
      password: 'admin'
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">管理员登录</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            请输入您的管理员账号信息
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleTestLogin}
                disabled={loading}
              >
                使用测试账号
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>测试账号信息：</p>
            <p>用户名: admin</p>
            <p>密码: admin</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminLogin