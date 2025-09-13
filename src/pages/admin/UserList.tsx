/**
 * 用户管理页面
 */
import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, RefreshCw, Users, Calendar, Mail, User, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserList } from '@/hooks/api/use-user-api'
import type { 
  AdminUserQueryRequest,
  UserRoleValue
} from '@/types/user'
import {
  UserRoleOptions,
  UserSortByOptions,
  UserSortDirOptions
} from '@/types/user'

export default function UserList() {
  const { loading, users, pagination, fetchUsers } = useUserList()
  
  // 搜索和筛选状态
  const [searchParams, setSearchParams] = useState<AdminUserQueryRequest>({
    page: 1,
    size: 20,
    sortBy: 'create_time',
    sortDir: 'DESC'
  })

  // 表单状态
  const [keyword, setKeyword] = useState('')
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState<UserRoleValue | 'all'>('all')
  const [createTimeStart, setCreateTimeStart] = useState('')
  const [createTimeEnd, setCreateTimeEnd] = useState('')

  // 初始化加载数据
  useEffect(() => {
    const initialParams: AdminUserQueryRequest = {
      page: 1,
      size: 20,
      sortBy: 'create_time',
      sortDir: 'DESC'
    }
    setSearchParams(initialParams)
    fetchUsers(initialParams)
  }, [fetchUsers])

  // 搜索处理
  const handleSearch = useCallback(() => {
    const params: AdminUserQueryRequest = {
      ...searchParams,
      page: 1, // 重置到第一页
      keyword: keyword.trim() || undefined,
      userId: userId.trim() ? parseInt(userId.trim()) : undefined,
      role: role === 'all' ? undefined : role,
      createTimeStart: createTimeStart || undefined,
      createTimeEnd: createTimeEnd || undefined
    }
    
    // 调试信息
    console.log('搜索参数:', params)
    
    setSearchParams(params)
    fetchUsers(params)
  }, [searchParams, keyword, userId, role, createTimeStart, createTimeEnd, fetchUsers])

  // 重置搜索
  const handleReset = useCallback(() => {
    setKeyword('')
    setUserId('')
    setRole('all')
    setCreateTimeStart('')
    setCreateTimeEnd('')
    
    const params: AdminUserQueryRequest = {
      page: 1,
      size: 20,
      sortBy: 'create_time',
      sortDir: 'DESC'
    }
    
    setSearchParams(params)
    fetchUsers(params)
  }, [fetchUsers])

  // 分页处理
  const handlePageChange = useCallback((newPage: number) => {
    const params = { ...searchParams, page: newPage }
    setSearchParams(params)
    fetchUsers(params)
  }, [searchParams, fetchUsers])

  // 每页大小变更
  const handlePageSizeChange = useCallback((newSize: string) => {
    const params = { ...searchParams, page: 1, size: parseInt(newSize) }
    setSearchParams(params)
    fetchUsers(params)
  }, [searchParams, fetchUsers])

  // 排序变更
  const handleSortChange = useCallback((sortBy: string, sortDir: string) => {
    const params = { ...searchParams, sortBy, sortDir, page: 1 }
    setSearchParams(params)
    fetchUsers(params)
  }, [searchParams, fetchUsers])

  // 获取用户角色徽章
  const getUserRoleBadge = (role: UserRoleValue) => {
    return role === 'ADMIN' 
      ? <Badge variant="default" className="bg-red-100 text-red-800"><Crown className="w-3 h-3 mr-1" />管理员</Badge>
      : <Badge variant="secondary"><User className="w-3 h-3 mr-1" />普通用户</Badge>
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
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
        <p className="text-muted-foreground">管理系统用户信息</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
            <p className="text-xs text-muted-foreground">
              当前页显示 {users.length} 个用户
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">普通用户</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'USER').length}
            </div>
            <p className="text-xs text-muted-foreground">
              当前页普通用户数量
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">管理员</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'ADMIN').length}
            </div>
            <p className="text-xs text-muted-foreground">
              当前页管理员数量
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">域名总数</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.reduce((sum, user) => sum + user.domainCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              当前页用户域名总数
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            搜索筛选
          </CardTitle>
          <CardDescription>
            支持按关键词、用户ID、角色、创建时间等条件筛选用户
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 第一行：关键词搜索和用户ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">关键词搜索</label>
              <Input
                placeholder="搜索用户名、邮箱..."
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

          {/* 第二行：角色筛选 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">用户角色</label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRoleValue | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="选择用户角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部角色</SelectItem>
                  {UserRoleOptions.map(option => (
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
                  {UserSortByOptions.map(option => (
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

          {/* 第三行：时间范围 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">创建时间开始</label>
              <Input
                type="datetime-local"
                value={createTimeStart}
                onChange={(e) => setCreateTimeStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">创建时间结束</label>
              <Input
                type="datetime-local"
                value={createTimeEnd}
                onChange={(e) => setCreateTimeEnd(e.target.value)}
              />
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

      {/* 用户列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>用户列表</CardTitle>
              <CardDescription>
                共 {pagination.total} 个用户，第 {pagination.page} / {pagination.totalPages} 页
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
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            // 空状态
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">暂无用户</h3>
              <p className="text-muted-foreground">没有找到符合条件的用户</p>
            </div>
          ) : (
            // 用户表格
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户ID</TableHead>
                    <TableHead>用户信息</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>统计信息</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>更新时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const createTime = formatDateTime(user.createTime)
                    const updateTime = formatDateTime(user.updateTime)
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-mono text-sm">{user.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{user.username}</div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getUserRoleBadge(user.role)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">{user.domainCount}</span> 个域名
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">{user.dnsRecordCount}</span> 条DNS记录
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{createTime.date}</div>
                            <div className="text-xs text-muted-foreground">{createTime.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">{updateTime.date}</div>
                            <div className="text-xs text-muted-foreground">{updateTime.time}</div>
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
          {!loading && users.length > 0 && (
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