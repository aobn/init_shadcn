import { createBrowserRouter } from 'react-router-dom';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLogin />
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />
  }
]);

export default router;