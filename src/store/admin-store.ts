import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Admin, AdminState } from '@/types/admin'

interface AdminActions {
  setAdmin: (admin: Admin) => void
  setToken: (token: string) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  clearAdmin: () => void
  initializeFromStorage: () => void
}

interface ExtendedAdminState extends AdminState {
  adminInfo: Admin | null
}

type AdminStore = ExtendedAdminState & AdminActions

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      admin: null,
      adminInfo: null, // 添加 adminInfo 属性以兼容现有代码
      token: null,
      isAuthenticated: false,

      // 设置管理员信息
      setAdmin: (admin: Admin) => set({ admin, adminInfo: admin }),

      // 设置token
      setToken: (token: string) => set({ token }),

      // 设置认证状态
      setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),

      // 清除管理员信息
      clearAdmin: () => set({
        admin: null,
        adminInfo: null,
        token: null,
        isAuthenticated: false,
      }),

      // 从localStorage初始化状态
      initializeFromStorage: () => {
        try {
          const token = localStorage.getItem('admin_token')
          const adminInfo = localStorage.getItem('admin_info')
          
          if (token && adminInfo) {
            const admin = JSON.parse(adminInfo)
            // 只有当前状态未认证时才更新状态，避免无限循环
            const currentState = get()
            if (!currentState.isAuthenticated) {
              set({
                admin,
                adminInfo: admin,
                token,
                isAuthenticated: true,
              })
            }
          } else {
            // 如果没有有效的登录信息，确保清除状态
            const currentState = get()
            if (currentState.isAuthenticated) {
              set({
                admin: null,
                adminInfo: null,
                token: null,
                isAuthenticated: false,
              })
            }
          }
        } catch (error) {
          console.error('初始化管理员状态失败:', error)
          get().clearAdmin()
        }
      },
    }),
    {
      name: 'admin-store',
      // 只持久化基本信息，token从localStorage获取
      partialize: (state) => ({
        admin: state.admin,
        adminInfo: state.adminInfo,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)