import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import DefaultLayout from '../layout/DefaultLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy load pages
const ClientHome = React.lazy(() => import('../page/client/Home'));
const AdminLogin = React.lazy(() => import('../page/admin/Login'));
const AdminCategories = React.lazy(() => import('../page/admin/Categories'));
const AdminArticles = React.lazy(() => import('../page/admin/Articles'));
const AdminChangePassword = React.lazy(() => import('../page/admin/ChangePassword'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <DefaultLayout>
            <ClientHome />
          </DefaultLayout>
        ),
      },
      {
        path: '/admin/login',
        element: <AdminLogin />,
      },
      {
        path: '/admin/categories',
        element: (
          <ProtectedRoute>
            <AdminCategories />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/articles',
        element: (
          <ProtectedRoute>
            <AdminArticles />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/change-password',
        element: (
          <ProtectedRoute>
            <AdminChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute>
            <AdminCategories />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
