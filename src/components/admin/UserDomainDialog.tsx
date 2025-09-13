/**
 * 用户域名详情弹窗组件
 */
import { useState, useEffect, useCallback } from 'react'
import { Search, Globe, Calendar, Eye, RefreshCw } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUserDomainList } from '@/hooks/api/use-user-domain-api'
import { UserDnsRecordDialog } from './UserDnsRecordDialog'
import type { 
  AdminUserDomainQueryRequest,
  UserDomainInfo
} from '@/types/user-domain'
import {
  DomainStatusOptions,
  DomainSortByOptions
} from '@/types/user-domain'
import { UserSortDirOptions } from '@/types/user'

interface UserDomainDialogProps {
  open: boolean
  onClose: () => void
  userId: number
  username: string
}

export function UserDomainDialog({ open, onClose, userId, username }: UserDomainDialogProps) {
  const { loading, domains, pagination, fetchUserDomains } = useUserDomainList()
  
  // 搜索和筛选状态
  const [searchParams, setSearchParams] = useState<AdminUserDomainQueryRequest>({
    page: 1,
    size: 20,
    sortBy: 'create_time',
    sortDir: 'DESC',
    userId: userId
  })

  // 表单状态
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<string>('all')

  // DNS记录弹窗状态
  const [dnsRecordDialog, setDnsRecordDialog] = useState<{
    open: boolean
    userId: number
    username: string
    domain: string
    fullDomain: string
  }>({
    open: false,
    userId: 0,
    username: '',
    domain: '',
    fullDomain: ''
  })

  // 初始化加载数据
  useEffect(() => {
    if (open && userId) {
      const initialParams: AdminUserDomainQueryRequest = {
        page: 1,
        size: 20,
        sortBy: 'create_time',
        sortDir: 'DESC',
        userId: userId
      }
      setSearchParams(initialParams)
      fetchUserDomains(initialParams)
    }
  }, [open, userId, fetchUserDomains])

  // 搜索处理
  const handleSearch = useCallback(() => {
    const params: AdminUserDomainQueryRequest = {
      ...searchParams,
      page: 1, // 重置到第一页
      keyword: keyword.trim() || undefined,
      status: status === 'all' ? undefined : status,
      userId: userId
    }
    
    console.log('用户域名搜索参数:', params)
    
    setSearchParams(params)
    fetchUserDomains(params)
  }, [searchParams, keyword, status, userId, fetchUserDomains])

  // 重置搜索
  const handleReset = useCallback(() => {
    setKeyword('')
    setStatus('all')
    
    const params: AdminUserDomainQueryRequest = {
      page: 1,
      size: 20,
      sortBy: 'create_time',
      sortDir: 'DESC',
      userId: userId
    }
    
    setSearchParams(params)
    fetchUserDomains(params)
  }, [userId, fetchUserDomains])

  // 分页处理
  const handlePageChange = useCallback((newPage: number) => {
    const params = { ...searchParams, page: newPage }
    setSearchParams(params)
    fetchUserDomains(params)
  }, [searchParams, fetchUserDomains])

  // 排序变更
  const handleSortChange = useCallback((sortBy: string, sortDir: string) => {
    const params = { ...searchParams, sortBy, sortDir, page: 1 }
    setSearchParams(params)
    fetchUserDomains(params)
  }, [searchParams, fetchUserDomains])

  // 获取域名状态徽章
  const getDomainStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-100 text-green-800">活跃</Badge>
      case 'INACTIVE':
        return <Badge variant="secondary">非活跃</Badge>
      case 'DELETED':
        return <Badge variant="destructive">已删除</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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

  // 查看DNS记录
  const handleViewDnsRecords = (domain: UserDomainInfo) => {
    setDnsRecordDialog({
      open: true,
      userId: domain.userId,
      username: domain.username,
      domain: domain.fullDomain,
      fullDomain: domain.fullDomain
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {username} 的域名列表
            </DialogTitle>
            <DialogDescription>
              查看用户 {username} (ID: {userId}) 拥有的所有域名
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 搜索筛选区域 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium">关键词搜索</label>
                <Input
                  placeholder="搜索域名..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">域名状态</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    {DomainStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">排序字段</label>
                <Select value={searchParams.sortBy} onValueChange={(value) => handleSortChange(value, searchParams.sortDir || 'DESC')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DomainSortByOptions.map(option => (
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
                    {UserSortDirOptions.map(option => (
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

            {/* 域名列表 */}
            <div className="border rounded-lg">
              {loading ? (
                // 加载骨架屏
                <div className="p-4 space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[120px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  ))}
                </div>
              ) : domains.length === 0 ? (
                // 空状态
                <div className="text-center py-12">
                  <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">暂无域名</h3>
                  <p className="text-muted-foreground">该用户还没有注册任何域名</p>
                </div>
              ) : (
                // 域名表格
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>域名信息</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>备注</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {domains.map((domain) => {
                      const createTime = formatDateTime(domain.createTime)
                      
                      return (
                        <TableRow key={domain.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{domain.fullDomain}</div>
                              <div className="text-sm text-muted-foreground">
                                {domain.subdomain}.{domain.domain}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getDomainStatusBadge(domain.status)}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate" title={domain.remark}>
                              {domain.remark || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{createTime.date}</div>
                              <div className="text-xs text-muted-foreground">{createTime.time}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDnsRecords(domain)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              查看DNS记录
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}

              {/* 分页控件 */}
              {!loading && domains.length > 0 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    共 {pagination.total} 个域名，第 {pagination.page} / {pagination.totalPages} 页
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

      {/* DNS记录详情弹窗 */}
      <UserDnsRecordDialog
        open={dnsRecordDialog.open}
        onClose={() => setDnsRecordDialog(prev => ({ ...prev, open: false }))}
        userId={dnsRecordDialog.userId}
        username={dnsRecordDialog.username}
        domain={dnsRecordDialog.domain}
        fullDomain={dnsRecordDialog.fullDomain}
      />
    </>
  )
}