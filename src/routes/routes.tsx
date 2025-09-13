import { createBrowserRouter, redirect } from 'react-router-dom';
import AdminLogin from '@/pages/AdminLogin';
import DomainDashboard from '@/pages/DomainDashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import DomainList from '@/pages/admin/DomainList';

// 认证检查函数
function checkAuth() {
  const token = localStorage.getItem('admin_token');
  const adminInfo = localStorage.getItem('admin_info');
  return !!(token && adminInfo);
}

// 受保护路由的 loader 函数
function protectedLoader() {
  if (!checkAuth()) {
    throw redirect('/');
  }
  return null;
}

// 登录页面的 loader 函数
function loginLoader() {
  if (checkAuth()) {
    throw redirect('/admin/dashboard');
  }
  return null;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLogin />,
    loader: loginLoader
  },
  {
    path: '/admin',
    element: <DomainDashboard />,
    loader: protectedLoader,
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'domains',
        element: <DomainList />
      }
    ]
  }
]);

export default router;