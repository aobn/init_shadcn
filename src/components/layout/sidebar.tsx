import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  LayoutDashboard, 
  Users, 
  Globe, 
  Server, 
  LogOut,
  Settings
} from 'lucide-react'
import { useAdminStore } from '@/store/admin-store'

interface SidebarProps {
  className?: string
}

const navigation = [
  {
    name: '仪表板',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: '用户管理',
    href: '/users',
    icon: Users
  },
  {
    name: '域名管理',
    href: '/domains',
    icon: Globe
  },
  {
    name: 'DNS管理',
    href: '/dns',
    icon: Server
  }
]

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const { admin, logout } = useAdminStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <div className={cn('flex h-full w-64 flex-col bg-gray-50 dark:bg-gray-900', className)}>
      {/* Logo区域 */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-2">
          <Globe className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            域名管理
          </span>
        </div>
      </div>

      <Separator />

      {/* 导航菜单 */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* 用户信息和退出 */}
      <div className="p-4">
        <div className="mb-4 rounded-lg bg-white p-3 dark:bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
              {admin?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {admin?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                管理员
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Settings className="mr-3 h-4 w-4" />
            设置
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20" 
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            退出登录
          </Button>
        </div>
      </div>
    </div>
  )
}