// 域名列表页面
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Globe, 
  Search, 
  Plus, 
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Clock,
  Edit,
  Trash2,
  Eye,
  User,
  Mail,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useUserDomains } from '@/hooks/api/use-domain-api'
import type { AdminUserDomainQueryRequest, UserDomainInfo } from '@/types/domain'
import { DomainStatus, DomainSortBy, SortDirection } from '@/types/domain'

/**
 * 域名列表页面
 * 显示和管理所有用户域名
 */
export default function DomainList() {
  const { data, loading, error, fetchUserDomains, refresh } = useUserDomains()
  
  // 查询参数状态
  const [queryParams, setQueryParams] = useState<AdminUserDomainQueryRequest>({
    page: 1,
    size: 20,
    sortBy: DomainSortBy.CREATE_TIME,
    sortDir: SortDirection.DESC
  })
  
  // 筛选状态
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [domainFilter, setDomainFilter] = useState<string>('')

  // 初始加载数据
  useEffect(() => {
    fetchUserDomains(queryParams)
  }, [fetchUserDomains])

  // 处理筛选
  const handleSearch = () => {
    const newParams = {
      ...queryParams,
      page: 1, // 重置到第一页
      status: statusFilter || undefined,
      domain: domainFilter || undefined
    }
    setQueryParams(newParams)
    fetchUserDomains(newParams)
  }

  // 处理分页
  const handlePageChange = (newPage: number) => {
    const newParams = { ...queryParams, page: newPage }
    setQueryParams(newParams)
    fetchUserDomains(newParams)
  }

  // 处理每页大小变更
  const handleSizeChange = (newSize: string) => {
    const size = parseInt(newSize)
    const newParams = { ...queryParams, page: 1, size }
    setQueryParams(newParams)
    fetchUserDomains(newParams)
  }

  // 处理排序
  const handleSort = (sortBy: string) => {
    const newSortDir = queryParams.sortBy === sortBy && queryParams.sortDir === SortDirection.DESC 
      ? SortDirection.ASC 
      : SortDirection.DESC
    const newParams = { ...queryParams, sortBy, sortDir: newSortDir }
    setQueryParams(newParams)
    fetchUserDomains(newParams)
  }

  // 刷新数据
  const handleRefresh = () => {
    refresh(queryParams)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case DomainStatus.ACTIVE:
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            正常
          </Badge>
        )
      case DomainStatus.INACTIVE:
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            未激活
          </Badge>
        )
      case DomainStatus.DELETED:
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            已删除
          </Badge>
        )
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 获取唯一的主域名列表用于筛选
  const uniqueDomains = data ? Array.from(new Set(data.content.map(item => item.domain))) : []

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">用户域名列表</h1>
          <p className="text-muted-foreground">
            管理所有用户的域名注册信息
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            添加域名
          </Button>
        </div>
      </div>

      {/* 筛选 */}
      <Card>
        <CardHeader>
          <CardTitle>筛选</CardTitle>
          <CardDescription>
            按状态和主域名筛选域名列表
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value={DomainStatus.ACTIVE}>正常</SelectItem>
                <SelectItem value={DomainStatus.INACTIVE}>未激活</SelectItem>
                <SelectItem value={DomainStatus.DELETED}>已删除</SelectItem>
              </SelectContent>
            </Select>

            <Select value={domainFilter || "all"} onValueChange={(value) => setDomainFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="主域名筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部域名</SelectItem>
                {uniqueDomains.map(domain => (
                  <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} disabled={loading}>
              筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 域名列表 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              用户域名列表 {data && `(${data.total})`}
            </CardTitle>
            <CardDescription>
              显示所有用户的域名注册信息和状态
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">每页显示</span>
            <Select value={queryParams.size?.toString()} onValueChange={handleSizeChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            // 加载状态
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : data && data.content.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort(DomainSortBy.FULL_DOMAIN)}
                    >
                      完整域名
                    </TableHead>
                    <TableHead>用户信息</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort(DomainSortBy.STATUS)}
                    >
                      状态
                    </TableHead>
                    <TableHead>域名组成</TableHead>
                    <TableHead>备注</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort(DomainSortBy.CREATE_TIME)}
                    >
                      创建时间
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort(DomainSortBy.UPDATE_TIME)}
                    >
                      更新时间
                    </TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.content.map((domain: UserDomainInfo) => (
                    <TableRow key={domain.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono">{domain.fullDomain}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{domain.username}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{domain.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(domain.status)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium text-blue-600">{domain.subdomain}</span>
                            <span className="text-muted-foreground">.</span>
                            <span className="text-muted-foreground">{domain.domain}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {domain.remark || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(domain.createTime)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(domain.updateTime)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">打开菜单</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              查看详情
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              编辑域名
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除域名
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 分页控件 */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    显示第 {(data.page - 1) * data.size + 1} - {Math.min(data.page * data.size, data.total)} 条，
                    共 {data.total} 条记录
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(data.page - 1)}
                      disabled={!data.hasPrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      上一页
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(data.totalPages - 4, data.page - 2)) + i
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === data.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(data.page + 1)}
                      disabled={!data.hasNext}
                    >
                      下一页
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            // 空状态
            <div className="text-center py-12">
              <Globe className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">暂无域名数据</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {statusFilter || domainFilter 
                  ? '没有找到符合条件的域名，请尝试调整筛选条件' 
                  : '还没有用户注册域名'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}