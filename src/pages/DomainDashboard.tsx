// 域名管理后台主页面
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DomainSidebar } from '@/components/layout/domain-sidebar'
import { DomainHeader } from '@/components/layout/domain-header'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

/**
 * 域名管理后台主页面
 * 采用抽屉式布局，包含侧边栏、头部和主内容区域
 */
export default function DomainDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <DomainSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* 主内容区域 */}
      <div className="lg:pl-64">
        {/* 头部 */}
        <DomainHeader>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </DomainHeader>

        {/* 页面内容 */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}