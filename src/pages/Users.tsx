import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Globe
} from 'lucide-react'
import { mockUsers, mockDomains, mockDelay } from '@/data/mock-data'
import type { User, UserFormData } from '@/types/domain'

export default function Users() {
  const navigate = useNavigate()
  const [users, setUsers] = useState(mockUsers)
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [viewingUserDomains, setViewingUserDomains] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  })

  // 筛选用户
  const filteredUsers = users.filter(user => {
    const matchesKeyword = !searchKeyword || 
      user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      user.email.toLowerCase().includes(searchKeyword.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesKeyword && matchesStatus
  })

  // 处理搜索
  const handleSearch = async () => {
    setLoading(true)
    await mockDelay(300)
    setLoading(false)
  }

  // 获取用户的域名
  const getUserDomains = (userId: number) => {
    return mockDomains.filter(domain => domain.userId === userId)
  }

  // 查看用户域名
  const handleViewUserDomains = (user: User) => {
    setViewingUserDomains(user)
  }

  // 跳转到DNS管理页面并筛选指定域名
  const handleViewDomainDns = (domainId: number, domainName: string) => {
    // 关闭当前对话框
    setViewingUserDomains(null)
    // 跳转到DNS管理页面，并传递域名ID作为查询参数
    navigate(`/admin/dns?domainId=${domainId}&domainName=${encodeURIComponent(domainName)}`)
  }

  // 处理创建/编辑用户
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await mockDelay(500)

    if (editingUser) {
      // 编辑用户
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              username: formData.username,
              email: formData.email,
              role: formData.role,
              status: formData.status,
              updatedAt: new Date().toISOString()
            }
          : user
      ))
    } else {
      // 创建新用户
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setUsers([...users, newUser])
    }

    setIsDialogOpen(false)
    setEditingUser(null)
    resetForm()
    setLoading(false)
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active'
    })
  }

  // 打开编辑对话框
  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status
    })
    setIsDialogOpen(true)
  }

  // 删除用户
  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个用户吗？')) {
      setLoading(true)
      await mockDelay(300)
      setUsers(users.filter(user => user.id !== id))
      setLoading(false)
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedUsers.length === 0) return
    if (confirm(`确定要删除选中的 ${selectedUsers.length} 个用户吗？`)) {
      setLoading(true)
      await mockDelay(500)
      setUsers(users.filter(user => !selectedUsers.includes(user.id)))
      setSelectedUsers([])
      setLoading(false)
    }
  }

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  // 处理单选
  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">用户管理</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">管理系统用户账户 (模拟数据)</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingUser(null) }}>
              <Plus className="mr-2 h-4 w-4" />
              添加用户
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? '编辑用户' : '添加用户'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  placeholder={editingUser ? '留空则不修改密码' : ''}
                />
              </div>
              <div>
                <Label htmlFor="role">角色</Label>
                <Select value={formData.role} onValueChange={(value: 'admin' | 'user') => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">普通用户</SelectItem>
                    <SelectItem value="admin">管理员</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">状态</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">活跃</SelectItem>
                    <SelectItem value="inactive">非活跃</SelectItem>
                  </SelectContent>
                </Select>
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
                  placeholder="搜索用户名或邮箱..."
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
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? '搜索中...' : '搜索'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 批量操作 */}
      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                已选择 {selectedUsers.length} 个用户
              </span>
              <Button variant="destructive" size="sm" onClick={handleBatchDelete} disabled={loading}>
                <Trash2 className="mr-2 h-4 w-4" />
                批量删除
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 用户列表 */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表 (共 {filteredUsers.length} 个)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>用户名</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="w-24">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? '管理员' : '普通用户'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status === 'active' ? '活跃' : '非活跃'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewUserDomains(user)}
                        disabled={loading}
                        title="查看域名"
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchKeyword || statusFilter ? '没有找到匹配的用户' : '暂无用户数据'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 查看用户域名对话框 */}
      <Dialog open={!!viewingUserDomains} onOpenChange={() => setViewingUserDomains(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {viewingUserDomains?.username} 的域名列表
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {viewingUserDomains && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    共 {getUserDomains(viewingUserDomains.id).length} 个域名
                  </span>
                </div>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>域名</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>注册时间</TableHead>
                        <TableHead>到期时间</TableHead>
                        <TableHead>自动续费</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getUserDomains(viewingUserDomains.id).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            该用户暂无注册域名
                          </TableCell>
                        </TableRow>
                      ) : (
                        getUserDomains(viewingUserDomains.id).map((domain) => (
                          <TableRow key={domain.id}>
                            <TableCell className="font-medium">
                              <Button
                                variant="link"
                                className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                                onClick={() => handleViewDomainDns(domain.id, domain.name)}
                              >
                                {domain.name}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  domain.status === 'active' ? 'default' : 
                                  domain.status === 'expired' ? 'destructive' : 'secondary'
                                }
                              >
                                {domain.status === 'active' ? '活跃' : 
                                 domain.status === 'expired' ? '已过期' : '非活跃'}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(domain.registeredAt).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(domain.expiresAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={domain.autoRenew ? 'default' : 'secondary'}>
                                {domain.autoRenew ? '已开启' : '已关闭'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}