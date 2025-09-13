// 域名管理系统侧边栏组件
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Globe, 
  Settings, 
  Database, 
  BarChart3, 
  Users, 
  FileText,
  X,
  Home
} from 'lucide-react'

interface DomainSidebarProps {
  open: boolean
  onClose: () => void
}

// 导航菜单配置
const navigationItems = [
  {
    title: '概览',
    items: [
      {
        title: '仪表板',
        href: '/admin/dashboard',
        icon: Home,
        description: '系统概览和统计信息'
      }
    ]
  },
  {
    title: '域名管理',
    items: [
      {
        title: '域名列表',
        href: '/admin/domains',
        icon: Globe,
        description: '查看和管理所有域名'
      },
      {
        title: 'DNS记录',
        href: '/admin/dns',
        icon: Database,
        description: '管理DNS解析记录'
      }
    ]
  },
  {
    title: '统计分析',
    items: [
      {
        title: '访问统计',
        href: '/admin/analytics',
        icon: BarChart3,
        description: '域名访问数据分析'
      },
      {
        title: '性能监控',
        href: '/admin/monitoring',
        icon: BarChart3,
        description: '域名性能监控'
      }
    ]
  },
  {
    title: '系统管理',
    items: [
      {
        title: '用户管理',
        href: '/admin/users',
        icon: Users,
        description: '管理系统用户'
      },
      {
        title: '操作日志',
        href: '/admin/logs',
        icon: FileText,
        description: '查看系统操作日志'
      },
      {
        title: '系统设置',
        href: '/admin/settings',
        icon: Settings,
        description: '系统配置和设置'
      }
    ]
  }
]

/**
 * 域名管理系统侧边栏组件
 * 提供导航菜单和系统功能入口
 */
export function DomainSidebar({ open, onClose }: DomainSidebarProps) {
  const location = useLocation()

  return (
    <>
      {/* 桌面端侧边栏 */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Globe className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">域名管理</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-6">
                {navigationItems.map((group) => (
                  <div key={group.title}>
                    <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.href
                        
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                              'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                          >
                            <Icon className="mr-3 h-4 w-4 shrink-0" />
                            <div className="flex-1">
                              <div>{item.title}</div>
                              <div className="text-xs opacity-70">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </nav>
        </div>
      </div>

      {/* 移动端侧边栏 */}
      <div className={cn(
        'fixed inset-y-0 z-50 flex w-64 flex-col transition-transform duration-300 ease-in-out lg:hidden',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4 border-r border-border">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">域名管理</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-6">
                {navigationItems.map((group) => (
                  <div key={group.title}>
                    <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.href
                        
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={onClose}
                            className={cn(
                              'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                          >
                            <Icon className="mr-3 h-4 w-4 shrink-0" />
                            <div className="flex-1">
                              <div>{item.title}</div>
                              <div className="text-xs opacity-70">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </nav>
        </div>
      </div>
    </>
  )
}