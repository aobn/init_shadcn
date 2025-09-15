// 管理员仪表板页面
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Globe, 
  Database, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react'

/**
 * 管理员仪表板页面
 * 显示系统概览、统计信息和快速操作
 */
export default function AdminDashboard() {
  // 模拟数据
  const stats = {
    totalDomains: 156,
    activeDomains: 142,
    expiringSoon: 8,
    sslCertificates: 134,
    dnsRecords: 1247
  }

  const recentDomains = [
    { name: 'example.com', status: 'active', expiryDate: '2024-12-15', ssl: true },
    { name: 'test.org', status: 'expiring', expiryDate: '2024-10-20', ssl: true },
    { name: 'demo.net', status: 'active', expiryDate: '2025-03-10', ssl: false },
    { name: 'sample.io', status: 'inactive', expiryDate: '2024-11-05', ssl: true }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />正常</Badge>
      case 'expiring':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />即将过期</Badge>
      case 'inactive':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />未激活</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
          <p className="text-muted-foreground">
            域名管理系统概览和统计信息
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          添加域名
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              总域名数
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDomains}</div>
            <p className="text-xs text-muted-foreground">
              +12% 较上月
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              活跃域名
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDomains}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.activeDomains / stats.totalDomains) * 100).toFixed(1)}% 活跃率
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              即将过期
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">
              30天内过期
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              SSL证书
            </CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sslCertificates}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.sslCertificates / stats.totalDomains) * 100).toFixed(1)}% 覆盖率
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 最近域名 */}
      <Card>
        <CardHeader>
          <CardTitle>最近域名</CardTitle>
          <CardDescription>
            最近添加或更新的域名列表
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDomains.map((domain, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{domain.name}</p>
                    <p className="text-sm text-muted-foreground">
                      过期时间: {domain.expiryDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {domain.ssl && <Shield className="h-4 w-4 text-green-500" />}
                  {getStatusBadge(domain.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


    </div>
  )
}