import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Globe, 
  Server, 
  TrendingUp,
  AlertTriangle,
  Clock
} from 'lucide-react'
import { useDashboard } from '@/hooks/api/use-domain-api'

export default function Dashboard() {
  const { stats, loading, error, getStats } = useDashboard()

  useEffect(() => {
    getStats()
  }, [getStats])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={getStats}>重试</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">仪表板</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">域名管理系统概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              较上月增长 12%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总域名数</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDomains || 0}</div>
            <p className="text-xs text-muted-foreground">
              活跃域名 {stats?.activeDomains || 0} 个
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DNS记录数</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDnsRecords || 0}</div>
            <p className="text-xs text-muted-foreground">
              分布在 {stats?.totalDomains || 0} 个域名
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">即将过期</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.expiredDomains || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              30天内到期域名
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 最近活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近用户 */}
        <Card>
          <CardHeader>
            <CardTitle>最近注册用户</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentUsers?.length ? (
                stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status === 'active' ? '活跃' : '非活跃'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">暂无数据</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 最近域名 */}
        <Card>
          <CardHeader>
            <CardTitle>最近添加域名</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentDomains?.length ? (
                stats.recentDomains.map((domain) => (
                  <div key={domain.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{domain.name}</p>
                      <p className="text-xs text-gray-500">
                        到期时间: {new Date(domain.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        domain.status === 'active' ? 'default' : 
                        domain.status === 'expired' ? 'destructive' : 'secondary'
                      }
                    >
                      {domain.status === 'active' ? '活跃' : 
                       domain.status === 'expired' ? '已过期' : '非活跃'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">暂无数据</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}