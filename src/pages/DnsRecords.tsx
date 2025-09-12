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
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Network
} from 'lucide-react'
import { useDnsRecords, useDomains } from '@/hooks/api/use-domain-api'
import type { DnsRecord, DnsRecordFormData } from '@/types/domain'

export default function DnsRecords() {
  const { 
    dnsRecords, 
    loading, 
    error, 
    actionLoading,
    getDnsRecords, 
    createDnsRecord, 
    updateDnsRecord, 
    deleteDnsRecord,
    batchDeleteDnsRecords
  } = useDnsRecords()

  const { domains, getDomains } = useDomains()

  const [searchKeyword, setSearchKeyword] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [domainFilter, setDomainFilter] = useState<string>('')
  const [selectedRecords, setSelectedRecords] = useState<number[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DnsRecord | null>(null)
  const [formData, setFormData] = useState<DnsRecordFormData>({
    domainId: 0,
    type: 'A',
    name: '',
    value: '',
    ttl: 300,
    priority: 0
  })

  // 加载数据
  useEffect(() => {
    getDnsRecords({
      page: 1,
      pageSize: 20,
      keyword: searchKeyword,
      type: typeFilter,
      domainId: domainFilter ? Number(domainFilter) : undefined
    })
    getDomains({ page: 1, pageSize: 100 }) // 加载域名列表用于选择
  }, [getDnsRecords, getDomains, searchKeyword, typeFilter, domainFilter])

  // 处理搜索
  const handleSearch = () => {
    getDnsRecords({
      page: 1,
      pageSize: 20,
      keyword: searchKeyword,
      type: typeFilter,
      domainId: domainFilter ? Number(domainFilter) : undefined
    })
  }

  // 处理创建/编辑DNS记录
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingRecord) {
        await updateDnsRecord(editingRecord.id, formData)
      } else {
        await createDnsRecord(formData)
      }
      setIsDialogOpen(false)
      setEditingRecord(null)
      resetForm()
      getDnsRecords({ 
        page: 1, 
        pageSize: 20, 
        keyword: searchKeyword, 
        type: typeFilter,
        domainId: domainFilter ? Number(domainFilter) : undefined
      })
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      domainId: 0,
      type: 'A',
      name: '',
      value: '',
      ttl: 300,
      priority: 0
    })
  }

  // 打开编辑对话框
  const handleEdit = (record: DnsRecord) => {
    setEditingRecord(record)
    setFormData({
      domainId: record.domainId,
      type: record.type,
      name: record.name,
      value: record.value,
      ttl: record.ttl,
      priority: record.priority || 0
    })
    setIsDialogOpen(true)
  }

  // 删除DNS记录
  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个DNS记录吗？')) {
      try {
        await deleteDnsRecord(id)
        getDnsRecords({ 
          page: 1, 
          pageSize: 20, 
          keyword: searchKeyword, 
          type: typeFilter,
          domainId: domainFilter ? Number(domainFilter) : undefined
        })
      } catch (error) {
        console.error('删除失败:', error)
      }
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRecords.length === 0) return
    if (confirm(`确定要删除选中的 ${selectedRecords.length} 个DNS记录吗？`)) {
      try {
        await batchDeleteDnsRecords(selectedRecords)
        setSelectedRecords([])
        getDnsRecords({ 
          page: 1, 
          pageSize: 20, 
          keyword: searchKeyword, 
          type: typeFilter,
          domainId: domainFilter ? Number(domainFilter) : undefined
        })
      } catch (error) {
        console.error('批量删除失败:', error)
      }
    }
  }

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRecords(dnsRecords?.list?.map(record => record.id) || [])
    } else {
      setSelectedRecords([])
    }
  }

  // 处理单选
  const handleSelectRecord = (recordId: number, checked: boolean) => {
    if (checked) {
      setSelectedRecords([...selectedRecords, recordId])
    } else {
      setSelectedRecords(selectedRecords.filter(id => id !== recordId))
    }
  }

  // 获取记录类型颜色
  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'A': return 'default'
      case 'AAAA': return 'secondary'
      case 'CNAME': return 'outline'
      case 'MX': return 'destructive'
      case 'TXT': return 'secondary'
      case 'NS': return 'outline'
      default: return 'secondary'
    }
  }

  // DNS记录类型选项
  const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'PTR']

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DNS管理</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">管理域名DNS解析记录</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingRecord(null) }}>
              <Plus className="mr-2 h-4 w-4" />
              添加DNS记录
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRecord ? '编辑DNS记录' : '添加DNS记录'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="domainId">域名</Label>
                <Select 
                  value={formData.domainId.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, domainId: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择域名" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains?.list?.map((domain) => (
                      <SelectItem key={domain.id} value={domain.id.toString()}>
                        {domain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">记录类型</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">记录名称</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="@, www, mail等"
                  required
                />
              </div>
              <div>
                <Label htmlFor="value">记录值</Label>
                <Textarea
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="IP地址、域名或其他值"
                  required
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ttl">TTL (秒)</Label>
                  <Input
                    id="ttl"
                    type="number"
                    value={formData.ttl}
                    onChange={(e) => setFormData({ ...formData, ttl: Number(e.target.value) })}
                    min="60"
                    max="86400"
                    required
                  />
                </div>
                {(formData.type === 'MX' || formData.type === 'SRV') && (
                  <div>
                    <Label htmlFor="priority">优先级</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                      min="0"
                      max="65535"
                    />
                  </div>
                )}
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
                  placeholder="搜索记录名称或值..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="域名筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部域名</SelectItem>
                {domains?.list?.map((domain) => (
                  <SelectItem key={domain.id} value={domain.id.toString()}>
                    {domain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="类型筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部类型</SelectItem>
                {recordTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>搜索</Button>
          </div>
        </CardContent>
      </Card>

      {/* 批量操作 */}
      {selectedRecords.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                已选择 {selectedRecords.length} 个DNS记录
              </span>
              <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                批量删除
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DNS记录列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Network className="mr-2 h-5 w-5" />
            DNS记录列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => getDnsRecords({ page: 1, pageSize: 20 })}>重试</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={dnsRecords?.list?.length > 0 && selectedRecords.length === dnsRecords.list.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>域名</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead>值</TableHead>
                  <TableHead>TTL</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="w-24">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dnsRecords?.list?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRecords.includes(record.id)}
                        onCheckedChange={(checked) => handleSelectRecord(record.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {domains?.list?.find(d => d.id === record.domainId)?.name || `域名${record.domainId}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeVariant(record.type)}>
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell className="max-w-xs truncate" title={record.value}>
                      {record.value}
                    </TableCell>
                    <TableCell>{record.ttl}s</TableCell>
                    <TableCell>
                      {record.priority !== undefined ? record.priority : '-'}
                    </TableCell>
                    <TableCell>{new Date(record.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      暂无DNS记录数据
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