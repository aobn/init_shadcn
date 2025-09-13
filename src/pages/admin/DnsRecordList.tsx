/**
 * DNS记录管理页面
 */
import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, RefreshCw, Eye, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useDnsRecordList } from '@/hooks/api/use-dns-record-api'
import type { 
  AdminDnsRecordQueryRequest,
  DnsRecordTypeValue,
  DnsRecordStatusValue,
  SyncStatusValue
} from '@/types/dns-record'
import {
  DnsRecordTypeOptions,
  DnsRecordStatusOptions,
  SyncStatusOptions,
  SortByOptions,
  SortDirOptions
} from '@/types/dns-record'

export default function DnsRecordList() {
  const { loading, dnsRecords, pagination, fetchDnsRecords } = useDnsRecordList()
  
  // 搜索和筛选状态
  const [searchParams, setSearchParams] = useState<AdminDnsRecordQueryRequest>({
    page: 1,
    size: 20,
    sortBy: 'create_time',
    sortDir: 'DESC'
  })

  // 表单状态
  const [keyword, setKeyword] = useState('')
  const [userId, setUserId] = useState('')
  const [recordType, setRecordType] = useState<DnsRecordTypeValue | 'all'>('all')
  const [status, setStatus] = useState<DnsRecordStatusValue | 'all'>('all')
  const [syncStatus, setSyncStatus] = useState<SyncStatusValue | 'all'>('all')
  const [domain, setDomain] = useState('')

  // 初始化加载数据
  useEffect(() => {
    handleSearch()
  }, [])

  // 搜索处理
  const handleSearch = useCallback(() => {
    const params: AdminDnsRecordQueryRequest = {
      ...searchParams,
      page: 1, // 重置到第一页
      keyword: keyword.trim() || undefined,
      userId: userId.trim() ? parseInt(userId.trim()) : undefined,
      recordType: recordType === 'all' ? undefined : recordType,
      status: status === 'all' ? undefined : status,
      syncStatus: syncStatus === 'all' ? undefined : syncStatus,
      domain: domain.trim() || undefined
    }
    
    setSearchParams(params)
    fetchDnsRecords(params)
  }, [searchParams, keyword, userId, recordType, status, syncStatus, domain, fetchDnsRecords])

  // 重置搜索
  const handleReset = useCallback(() => {
    setKeyword('')
    setUserId('')
    setRecordType('all')
    setStatus('all')
    setSyncStatus('all')
    setDomain('')
    
    const params: AdminDnsRecordQueryRequest = {
      page: 1,
      size: 20,
      sortBy: 'create_time',
      sortDir: 'DESC'
    }
    
    setSearchParams(params)
    fetchDnsRecords(params)
  }, [fetchDnsRecords])

  // 分页处理
  const handlePageChange = useCallback((newPage: number) => {
    const params = { ...searchParams, page: newPage }
    setSearchParams(params)
    fetchDnsRecords(params)
  }, [searchParams, fetchDnsRecords])

  // 每页大小变更
  const handlePageSizeChange = useCallback((newSize: string) => {
    const params = { ...searchParams, page: 1, size: parseInt(newSize) }
    setSearchParams(params)
    fetchDnsRecords(params)
  }, [searchParams, fetchDnsRecords])

  // 排序变更
  const handleSortChange = useCallback((sortBy: string, sortDir: string) => {
    const params = { ...searchParams, sortBy, sortDir, page: 1 }
    setSearchParams(params)
    fetchDnsRecords(params)
  }, [searchParams, fetchDnsRecords])

  // 获取同步状态徽章
  const getSyncStatusBadge = (syncStatus: SyncStatusValue, syncError?: string | null) => {
    switch (syncStatus) {
      case 'SUCCESS':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />同步成功</Badge>
      case 'FAILED':
        return <Badge variant="destructive" title={syncError || '同步失败'}><AlertCircle className="w-3 h-3 mr-1" />同步失败</Badge>
      case 'PENDING':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />待同步</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  // 获取记录状态徽章
  const getRecordStatusBadge = (status: DnsRecordStatusValue) => {
    return status === 'ENABLE' 
      ? <Badge variant="default" className="bg-blue-100 text-blue-800">启用</Badge>
      : <Badge variant="secondary">禁用</Badge>
  }

  // 获取记录类型徽章
  const getRecordTypeBadge = (type: DnsRecordTypeValue) => {
    const colors = {
      'A': 'bg-purple-100 text-purple-800',
      'AAAA': 'bg-purple-100 text-purple-800',
      'CNAME': 'bg-orange-100 text-orange-800',
      'MX': 'bg-red-100 text-red-800',
      'TXT': 'bg-yellow-100 text-yellow-800',
      'NS': 'bg-indigo-100 text-indigo-800',
      'SRV': 'bg-pink-100 text-pink-800',
      'CAA': 'bg-gray-100 text-gray-800'
    }
    
    return <Badge variant="outline" className={colors[type] || 'bg-gray-100 text-gray-800'}>{type}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">DNS记录管理</h1>
        <p className="text-muted-foreground">管理用户的DNS解析记录</p>
      </div>

      {/* 搜索和筛选区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            搜索筛选
          </CardTitle>
          <CardDescription>
            支持按关键词、用户ID、记录类型、状态等条件筛选DNS记录
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 第一行：关键词搜索和用户ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">关键词搜索</label>
              <Input
                placeholder="搜索用户名、邮箱、域名、记录名、记录值..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">用户ID</label>
              <Input
                placeholder="输入用户ID进行精确查询"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          {/* 第二行：记录类型、状态、同步状态 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">记录类型</label>
              <Select value={recordType} onValueChange={(value) => setRecordType(value as DnsRecordTypeValue | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="选择记录类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  {DnsRecordTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">记录状态</label>
              <Select value={status} onValueChange={(value) => setStatus(value as DnsRecordStatusValue | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="选择记录状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  {DnsRecordStatusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">同步状态</label>
              <Select value={syncStatus} onValueChange={(value) => setSyncStatus(value as SyncStatusValue | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="选择同步状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  {SyncStatusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 第三行：主域名和排序 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">主域名</label>
              <Input
                placeholder="输入主域名进行筛选"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">排序字段</label>
              <Select value={searchParams.sortBy} onValueChange={(value) => handleSortChange(value, searchParams.sortDir || 'DESC')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SortByOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">排序方向</label>
              <Select value={searchParams.sortDir} onValueChange={(value) => handleSortChange(searchParams.sortBy || 'create_time', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SortDirOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              搜索
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={loading}>
              重置
            </Button>
            <Button variant="outline" onClick={() => handleSearch()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* DNS记录列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>DNS记录列表</CardTitle>
              <CardDescription>
                共 {pagination.total} 条记录，第 {pagination.page} / {pagination.totalPages} 页
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">每页显示</span>
              <Select value={searchParams.size?.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">条</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            // 加载骨架屏
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ))}
            </div>
          ) : dnsRecords.length === 0 ? (
            // 空状态
            <div className="text-center py-12">
              <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">暂无DNS记录</h3>
              <p className="text-muted-foreground">没有找到符合条件的DNS记录</p>
            </div>
          ) : (
            // DNS记录表格
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户信息</TableHead>
                    <TableHead>域名信息</TableHead>
                    <TableHead>DNS记录</TableHead>
                    <TableHead>记录值</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>同步状态</TableHead>
                    <TableHead>TTL</TableHead>
                    <TableHead>更新时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dnsRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{record.username}</div>
                          <div className="text-sm text-muted-foreground">{record.email}</div>
                          <div className="text-xs text-muted-foreground">ID: {record.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{record.fullDomain}</div>
                          <div className="text-sm text-muted-foreground">
                            {record.subdomain}.{record.domain}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getRecordTypeBadge(record.type)}
                            <span className="font-mono text-sm">{record.name}</span>
                          </div>
                          {record.remark && (
                            <div className="text-xs text-muted-foreground">{record.remark}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm max-w-[200px] truncate" title={record.value}>
                          {record.value}
                        </div>
                        {record.mx && (
                          <div className="text-xs text-muted-foreground">MX: {record.mx}</div>
                        )}
                        {record.weight && (
                          <div className="text-xs text-muted-foreground">权重: {record.weight}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getRecordStatusBadge(record.status)}
                      </TableCell>
                      <TableCell>
                        {getSyncStatusBadge(record.syncStatus, record.syncError)}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{record.ttl}s</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{new Date(record.updateTime).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(record.updateTime).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* 分页控件 */}
          {!loading && dnsRecords.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                显示第 {(pagination.page - 1) * pagination.size + 1} - {Math.min(pagination.page * pagination.size, pagination.total)} 条，共 {pagination.total} 条记录
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevious}
                >
                  上一页
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, pagination.page - 2) + i
                    if (pageNum > pagination.totalPages) return null
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === pagination.page ? "default" : "outline"}
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
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}