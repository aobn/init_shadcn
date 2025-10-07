
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Globe, 
  Server, 
  TrendingUp,
  Calendar,
  AlertTriangle
} from 'lucide-react'
import { mockDashboardStats, mockUsers } from '@/data/mock-data'

export default function Dashboard() {
  const stats = mockDashboardStats

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
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              活跃用户: {stats.activeUsers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总域名数</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDomains}</div>
            <p className="text-xs text-muted-foreground">
              活跃: {stats.activeDomains} | 过期: {stats.expiredDomains}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DNS记录数</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDnsRecords}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              系统运行正常
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">即将过期</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.expiringDomains.length}</div>
            <p className="text-xs text-muted-foreground">
              30天内到期的域名
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近用户 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              最近注册用户
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.map((user) => (
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
                  <div className="text-right">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? '管理员' : '用户'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近域名 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              最近注册域名
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentDomains.map((domain) => {
                const user = mockUsers.find(u => u.id === domain.userId)
                return (
                  <div key={domain.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{domain.name}</p>
                      <p className="text-xs text-gray-500">
                        所有者: {user?.username || `用户${domain.userId}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          domain.status === 'active' ? 'default' : 
                          domain.status === 'expired' ? 'destructive' : 'secondary'
                        }
                      >
                        {domain.status === 'active' ? '活跃' : 
                         domain.status === 'expired' ? '已过期' : '非活跃'}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(domain.registeredAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 即将过期的域名 */}
      {stats.expiringDomains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              即将过期的域名
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.expiringDomains.map((domain) => {
                const user = mockUsers.find(u => u.id === domain.userId)
                const daysUntilExpiry = Math.ceil(
                  (new Date(domain.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )
                return (
                  <div key={domain.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium">{domain.name}</p>
                        <p className="text-xs text-gray-500">
                          所有者: {user?.username || `用户${domain.userId}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">
                        {daysUntilExpiry}天后过期
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(domain.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}