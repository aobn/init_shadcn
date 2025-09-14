import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useAdminLogin, useAdminLogout } from '@/hooks/api/use-admin-api'
import { useAdminStore } from '@/store/admin-store'


const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAdminLogin()
  const { logout } = useAdminLogout()
  const { admin, isAuthenticated } = useAdminStore()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: ''
  })

  // 登录成功后的重定向现在由路由 loader 处理
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/admin/dashboard')
  //   }
  // }, [isAuthenticated, navigate])

  // 处理表单输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 清除对应字段的错误信息
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // 表单验证
  const validateForm = () => {
    const errors = {
      username: '',
      password: ''
    }

    if (!formData.username.trim()) {
      errors.username = '用户名不能为空'
    } else if (formData.username.length < 2) {
      errors.username = '用户名至少需要2个字符'
    }

    if (!formData.password.trim()) {
      errors.password = '密码不能为空'
    } else if (formData.password.length < 3) {
      errors.password = '密码至少需要3个字符'
    }

    setFormErrors(errors)
    return !errors.username && !errors.password
  }

  // 处理登录提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 表单验证
    if (!validateForm()) {
      return
    }

    try {
      await login(formData)
      // 登录成功，清空表单并跳转到管理后台
      setFormData({ username: '', password: '' })
      setFormErrors({ username: '', password: '' })
      navigate('/admin/dashboard')
    } catch (error) {
      // 错误已经在钩子中处理
      console.error('登录失败:', error)
    }
  }

  // 处理登出
  const handleLogout = () => {
    logout()
    setFormData({ username: '', password: '' })
    setFormErrors({ username: '', password: '' })
  }



  // 如果已登录，显示登录状态
  if (isAuthenticated && admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">管理员已登录</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              欢迎回来，{admin.username}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 管理员信息展示 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">用户名:</span>
                <span className="font-medium">{admin.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">邮箱:</span>
                <span className="font-medium">{admin.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">角色:</span>
                <Badge variant="secondary">{admin.role}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">登录时间:</span>
                <span className="text-sm">
                  {new Date(admin.createTime).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>

            {/* 登出按钮 */}
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full"
            >
              登出
            </Button>

            {/* 功能提示 */}
            <div className="text-center text-sm text-muted-foreground">
              <p>✅ 登录状态正常</p>
              <p>🔑 Token认证有效</p>
              <p>📱 可以访问管理功能</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl">
        {/* 登录表单 */}
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
                  className={formErrors.username ? 'border-destructive' : ''}
                  required
                />
                {formErrors.username && (
                  <p className="text-sm text-destructive">{formErrors.username}</p>
                )}
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
                  className={formErrors.password ? 'border-destructive' : ''}
                  required
                />
                {formErrors.password && (
                  <p className="text-sm text-destructive">{formErrors.password}</p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>


          </CardContent>
        </Card>


      </div>
    </div>
  )
}

export default AdminLogin