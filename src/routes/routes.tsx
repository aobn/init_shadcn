import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import ApiDemo from '@/pages/ApiDemo';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLogin />
  },
  {
    path: '/api-demo',
    element: <App />,
    children: [
      {
        index: true,
        element: <ApiDemo />
      }
    ]
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />
  }
]);

export default router;