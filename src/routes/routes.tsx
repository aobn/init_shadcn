import { createBrowserRouter } from 'react-router-dom';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import MainLayout from '@/components/layout/main-layout';
import Dashboard from '@/pages/Dashboard';
import Users from '@/pages/Users';
import Domains from '@/pages/Domains';
import DnsRecords from '@/pages/DnsRecords';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'users',
        element: <Users />
      },
      {
        path: 'domains',
        element: <Domains />
      },
      {
        path: 'dns',
        element: <DnsRecords />
      }
    ]
  },
  // 保留旧的dashboard路由作为重定向
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />
  }
]);

export default router;