import { createBrowserRouter } from 'react-router-dom';
import AdminLogin from '@/pages/AdminLogin';
import DomainDashboard from '@/pages/DomainDashboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import DomainList from '@/pages/admin/DomainList';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLogin />
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <DomainDashboard />
      </ProtectedRoute>
    ),
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