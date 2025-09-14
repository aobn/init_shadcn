/**
 * 用户封禁对话框组件
 */
import { useState, useEffect } from 'react'
import { AlertTriangle, Ban, Shield, Clock } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUserBan, useUserBanDetails } from '@/hooks/api/use-user-ban-api'
import { BanReasonOptions } from '@/types/user-ban'
import type { UserInfo } from '@/types/user'

interface UserBanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserInfo | null
  onSuccess?: () => void
}

export function UserBanDialog({ open, onOpenChange, user, onSuccess }: UserBanDialogProps) {
  const { loading: banLoading, error: banError, banUser, unbanUser } = useUserBan()
  const { loading: detailsLoading, banDetails, fetchBanDetails } = useUserBanDetails()
  
  const [banReason, setBanReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [isCustomReason, setIsCustomReason] = useState(false)

  // 当对话框打开时，获取用户封禁详情
  useEffect(() => {
    if (open && user) {
      fetchBanDetails(user.id)
      setBanReason('')
      setCustomReason('')
      setIsCustomReason(false)
    }
  }, [open, user, fetchBanDetails])

  // 处理封禁原因选择
  const handleReasonChange = (value: string) => {
    setBanReason(value)
    setIsCustomReason(value === '其他原因')
    if (value !== '其他原因') {
      setCustomReason('')
    }
  }

  // 处理封禁用户
  const handleBanUser = async () => {
    if (!user) return

    const finalReason = isCustomReason ? customReason.trim() : banReason
    if (!finalReason) {
      alert('请选择或输入封禁原因')
      return
    }

    if (finalReason.length > 500) {
      alert('封禁原因不能超过500个字符')
      return
    }

    const success = await banUser({
      userId: user.id,
      banReason: finalReason
    })

    if (success) {
      onSuccess?.()
      onOpenChange(false)
    }
  }

  // 处理解封用户
  const handleUnbanUser = async () => {
    if (!user) return

    const success = await unbanUser({
      userId: user.id
    })

    if (success) {
      onSuccess?.()
      onOpenChange(false)
    }
  }

  // 格式化时间
  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return '-'
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    }
  }

  if (!user) return null

  const isBanned = banDetails?.isBanned || user.status === 'BANNED'
  const banTime = banDetails?.banTime ? formatDateTime(banDetails.banTime) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isBanned ? (
              <>
                <Ban className="h-5 w-5 text-red-500" />
                用户封禁管理
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 text-blue-500" />
                用户封禁管理
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            管理用户 {user.username} (ID: {user.id}) 的封禁状态
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 用户基本信息 */}
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">用户名</Label>
              <p className="text-sm font-medium">{user.username}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">邮箱</Label>
              <p className="text-sm">{user.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">当前状态</Label>
              <div className="flex items-center gap-2">
                {isBanned ? (
                  <Badge variant="destructive">已封禁</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-100 text-green-800">正常</Badge>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">角色</Label>
              <p className="text-sm">{user.role === 'ADMIN' ? '管理员' : '普通用户'}</p>
            </div>
          </div>

          {/* 封禁详情 */}
          {detailsLoading ? (
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">加载封禁详情中...</p>
            </div>
          ) : isBanned && banDetails ? (
            <div className="p-4 border rounded-lg bg-red-50">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <Label className="text-sm font-medium text-red-700">封禁详情</Label>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">封禁原因</Label>
                  <p className="text-sm">{banDetails.banReason || '-'}</p>
                </div>
                {banTime && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">封禁时间</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm">
                        {typeof banTime === 'object' ? `${banTime.date} ${banTime.time}` : banTime}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* 封禁操作 */}
          {!isBanned && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="banReason">封禁原因 *</Label>
                <Select value={banReason} onValueChange={handleReasonChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择封禁原因" />
                  </SelectTrigger>
                  <SelectContent>
                    {BanReasonOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isCustomReason && (
                <div className="space-y-2">
                  <Label htmlFor="customReason">自定义封禁原因 *</Label>
                  <Textarea
                    id="customReason"
                    placeholder="请输入具体的封禁原因..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    maxLength={500}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {customReason.length}/500 字符
                  </p>
                </div>
              )}

              {banError && (
                <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-sm text-red-600">{banError}</p>
                </div>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={banLoading}>
              取消
            </Button>
            
            {isBanned ? (
              <Button 
                onClick={handleUnbanUser} 
                disabled={banLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {banLoading ? '解封中...' : '解封用户'}
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={handleBanUser} 
                disabled={banLoading || !banReason || (isCustomReason && !customReason.trim())}
              >
                {banLoading ? '封禁中...' : '封禁用户'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}