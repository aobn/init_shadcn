// 通用类型定义

// 主题类型
export type Theme = 'light' | 'dark' | 'system';

// 路由类型
export interface Route {
  path: string;
  element: React.ReactNode;
  children?: Route[];
}

// 组件属性类型
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

// 导出API相关类型
export * from './api'

// 导出管理员相关类型
export * from './admin'

// 导出域名管理相关类型
export * from './domain'