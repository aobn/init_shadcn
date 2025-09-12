import { createBrowserRouter } from 'react-router-dom';
import AdminLogin from '@/pages/AdminLogin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLogin />
  }
]);

export default router;