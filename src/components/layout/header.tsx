
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/layout/mode-toggle'
import { Menu, Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  onMenuClick?: () => void
  title?: string
}

export function Header({ onMenuClick, title = '域名管理系统' }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-gray-900">
      {/* 左侧 */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>

      {/* 右侧 */}
      <div className="flex items-center space-x-4">
        {/* 通知 */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
          >
            3
          </Badge>
        </Button>

        {/* 主题切换 */}
        <ModeToggle />
      </div>
    </header>
  )
}