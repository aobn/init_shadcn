// 域名管理系统头部组件
import React from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModeToggle } from '@/components/mode-toggle'
import { Bell, Settings, LogOut, User } from 'lucide-react'
import { useAdminStore } from '@/store/admin-store'
import { useAdminLogout } from '@/hooks/api/use-admin-api'

interface DomainHeaderProps {
  children?: React.ReactNode
}

/**
 * 域名管理系统头部组件
 * 包含搜索、通知、用户菜单等功能
 */
export function DomainHeader({ children }: DomainHeaderProps) {
  const { adminInfo } = useAdminStore()
  const { logout } = useAdminLogout()

  const handleLogout = async () => {
    try {
      await logout()
      // 登出成功后会自动跳转到登录页
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* 移动端菜单按钮 */}
        {children}

        {/* 右侧功能区 */}
        <div className="flex items-center gap-2 ml-auto">
          {/* 通知按钮 */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive text-xs"></span>
          </Button>

          {/* 主题切换 */}
          <ModeToggle />

          {/* 用户菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={adminInfo?.username || 'Admin'} />
                  <AvatarFallback>
                    {adminInfo?.username?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {adminInfo?.username || '管理员'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminInfo?.email || 'admin@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>个人资料</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>设置</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}