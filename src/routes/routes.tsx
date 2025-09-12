import { createBrowserRouter } from 'react-router-dom';
import AdminLogin from '@/pages/AdminLogin';
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

]);

export default router;