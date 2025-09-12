// 管理员登录测试组件
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { testAdminLogin, testBackendConnection } from '@/utils/api-test'

export const AdminLoginTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    connection: boolean | null
    login: any | null
    error: string | null
  }>({
    connection: null,
    login: null,
    error: null
  })
  
  const [testing, setTesting] = useState(false)

  // 测试后端连接
  const handleTestConnection = async () => {
    setTesting(true)
    setTestResults(prev => ({ ...prev, error: null }))
    
    try {
      const result = await testBackendConnection()
      setTestResults(prev => ({ ...prev, connection: result }))
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        connection: false,
        error: error instanceof Error ? error.message : '连接测试失败'
      }))
    } finally {
      setTesting(false)
    }
  }

  // 测试登录接口
  const handleTestLogin = async () => {
    setTesting(true)
    setTestResults(prev => ({ ...prev, error: null }))
    
    try {
      const result = await testAdminLogin()
      setTestResults(prev => ({ ...prev, login: result }))
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        login: null,
        error: error instanceof Error ? error.message : '登录测试失败'
      }))
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">后端API测试</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 连接测试 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">后端连接:</span>
            {testResults.connection === null ? (
              <Badge variant="outline">未测试</Badge>
            ) : testResults.connection ? (
              <Badge variant="default">✅ 连接成功</Badge>
            ) : (
              <Badge variant="destructive">❌ 连接失败</Badge>
            )}
          </div>
          <Button 
            onClick={handleTestConnection}
            disabled={testing}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {testing ? '测试中...' : '测试后端连接'}
          </Button>
        </div>

        {/* 登录测试 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">登录接口:</span>
            {testResults.login === null ? (
              <Badge variant="outline">未测试</Badge>
            ) : testResults.login ? (
              <Badge variant="default">✅ 登录成功</Badge>
            ) : (
              <Badge variant="destructive">❌ 登录失败</Badge>
            )}
          </div>
          <Button 
            onClick={handleTestLogin}
            disabled={testing}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {testing ? '测试中...' : '测试登录接口'}
          </Button>
        </div>

        {/* 错误信息 */}
        {testResults.error && (
          <Alert variant="destructive">
            <AlertDescription>{testResults.error}</AlertDescription>
          </Alert>
        )}

        {/* 登录结果详情 */}
        {testResults.login && (
          <div className="text-xs text-muted-foreground">
            <p>✅ Token: {testResults.login.token?.substring(0, 20)}...</p>
            <p>✅ 用户: {testResults.login.admin?.username}</p>
          </div>
        )}

        {/* API配置信息 */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>API地址:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/'}</p>
          <p><strong>模拟API:</strong> {import.meta.env.VITE_USE_MOCK_API === 'true' ? '启用' : '禁用'}</p>
        </div>
      </CardContent>
    </Card>
  )
}