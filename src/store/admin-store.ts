import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Admin, AdminState } from '@/types/admin'

interface AdminActions {
  setAdmin: (admin: Admin) => void
  setToken: (token: string) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  clearAdmin: () => void
  logout: () => void
  initializeFromStorage: () => void
}

type AdminStore = AdminState & AdminActions

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      admin: null,
      token: null,
      isAuthenticated: false,

      // 设置管理员信息
      setAdmin: (admin: Admin) => set({ admin }),

      // 设置token
      setToken: (token: string) => set({ token }),

      // 设置认证状态
      setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),

      // 清除管理员信息
      clearAdmin: () => set({
        admin: null,
        token: null,
        isAuthenticated: false,
      }),

      // 退出登录
      logout: () => {
        // 清除localStorage中的数据
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_info')
        // 清除store状态
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
        })
      },

      // 从localStorage初始化状态
      initializeFromStorage: () => {
        try {
          const token = localStorage.getItem('admin_token')
          const adminInfo = localStorage.getItem('admin_info')
          
          if (token && adminInfo) {
            const admin = JSON.parse(adminInfo)
            set({
              admin,
              token,
              isAuthenticated: true,
            })
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
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)