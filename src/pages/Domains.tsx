import React, { useState } from 'react'
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
  AlertTriangle
} from 'lucide-react'
import { mockDomains, mockUsers, mockDelay } from '@/data/mock-data'
import type { Domain, DomainFormData } from '@/types/domain'

export default function Domains() {
  const [domains, setDomains] = useState(mockDomains)
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedDomains, setSelectedDomains] = useState<number[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null)
  const [formData, setFormData] = useState<DomainFormData>({
    name: '',
    userId: 0,
    autoRenew: false,
    expiresAt: ''
  })

  // 筛选域名
  const filteredDomains = domains.filter(domain => {
    const matchesKeyword = !searchKeyword || 
      domain.name.toLowerCase().includes(searchKeyword.toLowerCase())
    const matchesStatus = statusFilter === 'all' || domain.status === statusFilter
    return matchesKeyword && matchesStatus
  })

  // 处理搜索
  const handleSearch = async () => {
    setLoading(true)
    await mockDelay(300)
    setLoading(false)
  }

  // 处理创建/编辑域名
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await mockDelay(500)

    if (editingDomain) {
      // 编辑域名
      setDomains(domains.map(domain => 
        domain.id === editingDomain.id 
          ? { 
              ...domain, 
              name: formData.name,
              userId: formData.userId,
              autoRenew: formData.autoRenew,
              expiresAt: formData.expiresAt + 'T00:00:00Z',
              updatedAt: new Date().toISOString()
            }
          : domain
      ))
    } else {
      // 创建新域名
      const newDomain: Domain = {
        id: Math.max(...domains.map(d => d.id)) + 1,
        name: formData.name,
        userId: formData.userId,
        status: 'active',
        autoRenew: formData.autoRenew,
        registeredAt: new Date().toISOString(),
        expiresAt: formData.expiresAt + 'T00:00:00Z',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setDomains([...domains, newDomain])
    }

    setIsDialogOpen(false)
    setEditingDomain(null)
    resetForm()
    setLoading(false)
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
      setLoading(true)
      await mockDelay(300)
      setDomains(domains.filter(domain => domain.id !== id))
      setLoading(false)
    }
  }

  // 续费域名
  const handleRenew = async (id: number) => {
    const years = prompt('请输入续费年数:', '1')
    if (years && !isNaN(Number(years))) {
      setLoading(true)
      await mockDelay(500)
      setDomains(domains.map(domain => {
        if (domain.id === id) {
          const currentExpiry = new Date(domain.expiresAt)
          const newExpiry = new Date(currentExpiry.getTime() + Number(years) * 365 * 24 * 60 * 60 * 1000)
          return {
            ...domain,
            expiresAt: newExpiry.toISOString(),
            status: 'active' as const,
            updatedAt: new Date().toISOString()
          }
        }
        return domain
      }))
      setLoading(false)
      alert(`域名已成功续费 ${years} 年`)
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedDomains.length === 0) return
    if (confirm(`确定要删除选中的 ${selectedDomains.length} 个域名吗？`)) {
      setLoading(true)
      await mockDelay(500)
      setDomains(domains.filter(domain => !selectedDomains.includes(domain.id)))
      setSelectedDomains([])
      setLoading(false)
    }
  }

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDomains(filteredDomains.map(domain => domain.id))
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

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">域名管理</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">管理用户域名注册和续费 (模拟数据)</p>
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
                    {mockUsers.map((user) => (
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
                <Button type="submit" disabled={loading}>
                  {loading ? '保存中...' : '保存'}
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
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">非活跃</SelectItem>
                <SelectItem value="expired">已过期</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? '搜索中...' : '搜索'}
            </Button>
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
              <Button variant="destructive" size="sm" onClick={handleBatchDelete} disabled={loading}>
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
          <CardTitle>域名列表 (共 {filteredDomains.length} 个)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={filteredDomains.length > 0 && selectedDomains.length === filteredDomains.length}
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
              {filteredDomains.map((domain) => {
                const user = mockUsers.find(u => u.id === domain.userId)
                return (
                  <TableRow key={domain.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedDomains.includes(domain.id)}
                        onCheckedChange={(checked) => handleSelectDomain(domain.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell>
                      {user?.username || `用户${domain.userId}`}
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
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRenew(domain.id)}
                          className="text-green-600 hover:text-green-700"
                          disabled={loading}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(domain.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredDomains.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {searchKeyword || statusFilter ? '没有找到匹配的域名' : '暂无域名数据'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}