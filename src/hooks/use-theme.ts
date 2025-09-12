// 主题管理钩子
import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

/**
 * 主题管理钩子
 * 提供主题切换和持久化功能
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system'
    }
    return 'system'
  })

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const setTheme = (theme: Theme) => {
    localStorage.setItem('theme', theme)
    setThemeState(theme)
  }

  return {
    theme,
    setTheme,
  }
}