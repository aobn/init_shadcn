import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw,
  AlertTriangle,
  Calendar
} from 'lucide-react'
import { useDomains, useUsers } from '@/hooks/api/use-domain-api'
import type { Domain, DomainFormData } from '@/types/domain'

export default function Domains() {
  const { 
    domains, 
    loading, 
    error, 
    actionLoading,
    getDomains, 
    createDomain, 
    updateDomain, 
    deleteDomain,
    batchDeleteDomains,
    renewDomain
  } = useDomains()

  const { users, getUsers } = useUsers()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedDomains, setSelectedDomains] = useState<number[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null)
  const [formData, setFormData] = useState<DomainFormData>({
    name: '',
    userId: 0,
    autoRenew: false,
    expiresAt: ''
  })

  // 加载数据
  useEffect(() => {
    getDomains({
      page: 1,
      pageSize: 20,
      keyword: searchKeyword,
      status: statusFilter
    })
    getUsers({ page: 1, pageSize: 100 }) // 加载用户列表用于选择
  }, [getDomains, getUsers, searchKeyword, statusFilter])

  // 处理搜索
  const handleSearch = () => {
    getDomains({
      page: 1,
      pageSize: 20,
      keyword: searchKeyword,
      status: statusFilter
    })
  }

  // 处理创建/编辑域名
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingDomain) {
        await updateDomain(editingDomain.id, formData)
      } else {
        await createDomain(formData)
      }
      setIsDialogOpen(false)
      setEditingDomain(null)
      resetForm()
      getDomains({ page: 1, pageSize: 20, keyword: searchKeyword, status: statusFilter })
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      userId: 0,
      autoRenew: false,
      expiresAt: ''
    })
  }

  // 打开编辑对话框
  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain)
    setFormData({
      name: domain.name,
      userId: domain.userId,
      autoRenew: domain.autoRenew,
      expiresAt: domain.expiresAt.split('T')[0] // 转换为日期格式
    })
    setIsDialogOpen(true)
  }

  // 删除域名
  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个域名吗？')) {
      try {
        await deleteDomain(id)
        getDomains({ page: 1, pageSize: 20, keyword: searchKeyword, status: statusFilter })
      } catch (error) {
        console.error('删除失败:', error)
      }
    }
  }

  // 续费域名
  const handleRenew = async (id: number) => {
    const years = prompt('请输入续费年数:', '1')
    if (years && !isNaN(Number(years))) {
      try {
        await renewDomain(id, Number(years))
        getDomains({ page: 1, pageSize: 20, keyword: searchKeyword, status: statusFilter })
      } catch (error) {
        console.error('续费失败:', error)
      }
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedDomains.length === 0) return
    if (confirm(`确定要删除选中的 ${selectedDomains.length} 个域名吗？`)) {
      try {
        await batchDeleteDomains(selectedDomains)
        setSelectedDomains([])
        getDomains({ page: 1, pageSize: 20, keyword: searchKeyword, status: statusFilter })
      } catch (error) {
        console.error('批量删除失败:', error)
      }
    }
  }

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDomains(domains?.list?.map(domain => domain.id) || [])
    } else {
      setSelectedDomains([])
    }
  }

  // 处理单选
  const handleSelectDomain = (domainId: number, checked: boolean) => {
    if (checked) {
      setSelectedDomains([...selectedDomains, domainId])
    } else {
      setSelectedDomains(selectedDomains.filter(id => id !== domainId))
    }
  }

  // 获取域名状态颜色
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'expired': return 'destructive'
      case 'inactive': return 'secondary'
      default: return 'secondary'
    }
  }

  // 获取域名状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '活跃'
      case 'expired': return '已过期'
      case 'inactive': return '非活跃'
      default: return '未知'
    }
  }

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

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">域名管理</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">管理用户域名注册和续费</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingDomain(null) }}>
              <Plus className="mr-2 h-4 w-4" />
              添加域名
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDomain ? '编辑域名' : '添加域名'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">域名</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="userId">所属用户</Label>
                <Select 
                  value={formData.userId.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, userId: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择用户" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.list?.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.username} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expiresAt">到期时间</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoRenew"
                  checked={formData.autoRenew}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoRenew: checked })}
                />
                <Label htmlFor="autoRenew">自动续费</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading ? '保存中...' : '保存'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索域名..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部状态</SelectItem>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">非活跃</SelectItem>
                <SelectItem value="expired">已过期</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>搜索</Button>
          </div>
        </CardContent>
      </Card>

      {/* 批量操作 */}
      {selectedDomains.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                已选择 {selectedDomains.length} 个域名
              </span>
              <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                批量删除
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 域名列表 */}
      <Card>
        <CardHeader>
          <CardTitle>域名列表</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => getDomains({ page: 1, pageSize: 20 })}>重试</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={domains?.list?.length > 0 && selectedDomains.length === domains.list.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>域名</TableHead>
                  <TableHead>所属用户</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>到期时间</TableHead>
                  <TableHead>自动续费</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead className="w-32">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains?.list?.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedDomains.includes(domain.id)}
                        onCheckedChange={(checked) => handleSelectDomain(domain.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell>
                      {users?.list?.find(u => u.id === domain.userId)?.username || `用户${domain.userId}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(domain.status)}>
                        {getStatusText(domain.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{new Date(domain.expiresAt).toLocaleDateString()}</span>
                        {new Date(domain.expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                          <Badge variant="destructive" className="text-xs">
                            即将过期
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={domain.autoRenew ? 'default' : 'secondary'}>
                        {domain.autoRenew ? '是' : '否'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(domain.registeredAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(domain)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRenew(domain.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(domain.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      暂无域名数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}