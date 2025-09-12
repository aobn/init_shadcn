import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLogin, useUserInfo, useUserList } from '@/hooks/api/use-user-api'

const ApiDemo: React.FC = () => {
  const { login, loading: loginLoading, error: loginError } = useLogin()
  const { userInfo, getUserInfo, loading: userInfoLoading, error: userInfoError } = useUserInfo()
  const { userList, getUserList, loading: userListLoading, error: userListError } = useUserList()

  // 模拟登录
  const handleLogin = async () => {
    try {
      await login({
        username: 'testuser',
        password: 'password123'
      })
      console.log('登录成功')
    } catch (error) {
      console.error('登录失败:', error)
    }
  }

  // 获取用户信息
  const handleGetUserInfo = () => {
    getUserInfo()
  }

  // 获取用户列表
  const handleGetUserList = () => {
    getUserList({ page: 1, pageSize: 10 })
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API响应拦截器演示</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 登录测试 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">用户登录</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="username">用户名</Label>
                  <Input id="username" defaultValue="testuser" disabled />
                </div>
                <div>
                  <Label htmlFor="password">密码</Label>
                  <Input id="password" type="password" defaultValue="password123" disabled />
                </div>
                <Button 
                  onClick={handleLogin} 
                  disabled={loginLoading}
                  className="w-full"
                >
                  {loginLoading ? '登录中...' : '登录'}
                </Button>
                {loginError && (
                  <Alert variant="destructive">
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* 获取用户信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">用户信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleGetUserInfo} 
                  disabled={userInfoLoading}
                  className="w-full"
                >
                  {userInfoLoading ? '获取中...' : '获取用户信息'}
                </Button>
                {userInfoError && (
                  <Alert variant="destructive">
                    <AlertDescription>{userInfoError}</AlertDescription>
                  </Alert>
                )}
                {userInfo && (
                  <div className="text-sm space-y-1">
                    <p><strong>ID:</strong> {userInfo.id}</p>
                    <p><strong>用户名:</strong> {userInfo.username}</p>
                    <p><strong>邮箱:</strong> {userInfo.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 获取用户列表 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">用户列表</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleGetUserList} 
                  disabled={userListLoading}
                  className="w-full"
                >
                  {userListLoading ? '获取中...' : '获取用户列表'}
                </Button>
                {userListError && (
                  <Alert variant="destructive">
                    <AlertDescription>{userListError}</AlertDescription>
                  </Alert>
                )}
                {userList && userList.length > 0 && (
                  <div className="text-sm">
                    <p><strong>用户数量:</strong> {userList.length}</p>
                    <div className="mt-2 space-y-1">
                      {userList.slice(0, 3).map((user) => (
                        <p key={user.id}>{user.username} ({user.email})</p>
                      ))}
                      {userList.length > 3 && <p>...</p>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* API说明 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">响应拦截器功能</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">自动处理的HTTP状态码:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 200/201: 请求成功</li>
                    <li>• 400: 请求参数错误</li>
                    <li>• 401: 未授权，自动跳转登录</li>
                    <li>• 403: 禁止访问</li>
                    <li>• 404: 资源不存在</li>
                    <li>• 500: 服务器错误</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">拦截器特性:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 统一API响应格式处理</li>
                    <li>• 自动token认证</li>
                    <li>• 错误信息统一处理</li>
                    <li>• 网络错误处理</li>
                    <li>• 请求超时处理(10s)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

export default ApiDemo