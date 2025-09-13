/**
 * 用户DNS记录详情弹窗组件
 */
import { useState, useEffect, useCallback } from 'react'
import { Search, Database, RefreshCw } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUserDnsRecordList } from '@/hooks/api/use-user-dns-record-api'
import type { 
  AdminDnsRecordQueryRequest
} from '@/types/user-dns-record'
import {
  DnsRecordTypeOptions,
  DnsRecordStatusOptions,
  SyncStatusOptions,
  DnsRecordSortByOptions
} from '@/types/user-dns-record'
import { UserSortDirOptions } from '@/types/user'

interface UserDnsRecordDialogProps {
  open: boolean
  onClose: () => void
  userId: number
  username: string
  domain: string
  fullDomain: string
}

export function UserDnsRecordDialog({ open, onClose, userId, username, domain, fullDomain }: UserDnsRecordDialogProps) {
  const { loading, dnsRecords, pagination, fetchUserDnsRecords } = useUserDnsRecordList()
  
  // 搜索和筛选状态
  const [searchParams, setSearchParams] = useState<AdminDnsRecordQueryRequest>({
    page: 1,
    size: 20,
    sortBy: 'create_time',
    sortDir: 'DESC',
    userId: userId,
    keyword: domain // 使用keyword字段进行域名搜索
  })

  // 表单状态
  const [keyword, setKeyword] = useState('')
  const [recordType, setRecordType] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [syncStatus, setSyncStatus] = useState<string>('all')

  // 初始化加载数据
  useEffect(() => {
    if (open && userId && domain) {
      const initialParams: AdminDnsRecordQueryRequest = {
        page: 1,
        size: 20,
        sortBy: 'create_time',
        sortDir: 'DESC',
        userId: userId,
        keyword: domain
      }
      setSearchParams(initialParams)
      fetchUserDnsRecords(initialParams)
    }
  }, [open, userId, domain, fetchUserDnsRecords])

  // 搜索处理
  const handleSearch = useCallback(() => {
    const params: AdminDnsRecordQueryRequest = {
      ...searchParams,
      page: 1, // 重置到第一页
      keyword: keyword.trim() || undefined,
      recordType: recordType === 'all' ? undefined : recordType,
      status: status === 'all' ? undefined : status,
      syncStatus: syncStatus === 'all' ? undefined : syncStatus,
      userId: userId
    }
    
    console.log('用户DNS记录搜索参数:', params)
    
    setSearchParams(params)
    fetchUserDnsRecords(params)
  }, [searchParams, keyword, recordType, status, syncStatus, userId, domain, fetchUserDnsRecords])

  // 重置搜索
  const handleReset = useCallback(() => {
    setKeyword('')
    setRecordType('all')
    setStatus('all')
    setSyncStatus('all')
    
    const params: AdminDnsRecordQueryRequest = {
      page: 1,
      size: 20,
      sortBy: 'create_time',
      sortDir: 'DESC',
      userId: userId
    }
    
    setSearchParams(params)
    fetchUserDnsRecords(params)
  }, [userId, domain, fetchUserDnsRecords])

  // 分页处理
  const handlePageChange = useCallback((newPage: number) => {
    const params = { ...searchParams, page: newPage }
    setSearchParams(params)
    fetchUserDnsRecords(params)
  }, [searchParams, fetchUserDnsRecords])

  // 排序变更
  const handleSortChange = useCallback((sortBy: string, sortDir: string) => {
    const params = { ...searchParams, sortBy, sortDir, page: 1 }
    setSearchParams(params)
    fetchUserDnsRecords(params)
  }, [searchParams, fetchUserDnsRecords])

  // 获取记录类型徽章
  const getRecordTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-blue-100 text-blue-800',
      'AAAA': 'bg-purple-100 text-purple-800',
      'CNAME': 'bg-green-100 text-green-800',
      'MX': 'bg-orange-100 text-orange-800',
      'TXT': 'bg-gray-100 text-gray-800',
      'NS': 'bg-indigo-100 text-indigo-800',
      'SRV': 'bg-pink-100 text-pink-800',
      'CAA': 'bg-yellow-100 text-yellow-800'
    }
    
    return (
      <Badge variant="secondary" className={colors[type] || 'bg-gray-100 text-gray-800'}>
        {type}
      </Badge>
    )
  }

  // 获取记录状态徽章
  const getRecordStatusBadge = (status: string) => {
    return status === 'ENABLE' 
      ? <Badge variant="default" className="bg-green-100 text-green-800">启用</Badge>
      : <Badge variant="secondary">禁用</Badge>
  }

  // 获取同步状态徽章
  const getSyncStatusBadge = (syncStatus: string) => {
    switch (syncStatus) {
      case 'SUCCESS':
        return <Badge variant="default" className="bg-green-100 text-green-800">同步成功</Badge>
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">待同步</Badge>
      case 'FAILED':
        return <Badge variant="destructive">同步失败</Badge>
      default:
        return <Badge variant="outline">{syncStatus}</Badge>
    }
  }

  // 格式化时间
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-7xl h-[90vh] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {fullDomain} 的DNS记录
          </DialogTitle>
          <DialogDescription>
            查看用户 {username} 域名 {fullDomain} 的所有DNS记录
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col px-6 py-4 space-y-4">
          {/* 搜索筛选区域 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg flex-shrink-0">
            <div className="space-y-2">
              <label className="text-sm font-medium">关键词搜索</label>
              <Input
                placeholder="搜索记录名、记录值..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">记录类型</label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger>
                  <SelectValue placeholder="选择类型" />
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
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
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
              <Select value={syncStatus} onValueChange={setSyncStatus}>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">排序</label>
              <div className="flex gap-1">
                <Select value={searchParams.sortBy} onValueChange={(value) => handleSortChange(value, searchParams.sortDir || 'DESC')}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DnsRecordSortByOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={searchParams.sortDir} onValueChange={(value) => handleSortChange(searchParams.sortBy || 'create_time', value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UserSortDirOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

          {/* DNS记录列表 */}
          <div className="border rounded-lg flex-1 overflow-hidden flex flex-col">
            {loading ? (
              // 加载骨架屏
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                ))}
              </div>
            ) : dnsRecords.length === 0 ? (
              // 空状态
              <div className="text-center py-12">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">暂无DNS记录</h3>
                <p className="text-muted-foreground">该域名还没有配置任何DNS记录</p>
              </div>
            ) : (
              // DNS记录表格
              <div className="overflow-y-auto flex-1">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>主机记录</TableHead>
                    <TableHead>记录类型</TableHead>
                    <TableHead>记录值</TableHead>
                    <TableHead>TTL</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>同步状态</TableHead>
                    <TableHead>备注</TableHead>
                    <TableHead>创建时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dnsRecords.map((record) => {
                    const createTime = formatDateTime(record.createTime)
                    
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="font-medium">{record.name}</div>
                        </TableCell>
                        <TableCell>
                          {getRecordTypeBadge(record.type)}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate font-mono text-sm" title={record.value}>
                            {record.value}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{record.ttl}s</div>
                        </TableCell>
                        <TableCell>
                          {getRecordStatusBadge(record.status)}
                        </TableCell>
                        <TableCell>
                          {getSyncStatusBadge(record.syncStatus)}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[150px] truncate text-sm" title={record.remark}>
                            {record.remark || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{createTime.date}</div>
                            <div className="text-xs text-muted-foreground">{createTime.time}</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
                </Table>
              </div>
            )}

            {/* 分页控件 */}
            {!loading && dnsRecords.length > 0 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  共 {pagination.total} 条DNS记录，第 {pagination.page} / {pagination.totalPages} 页
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}