import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';
import EmptyLayout from '@/layouts/EmptyLayout';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import NotFoundPage from '@/pages/NotFound';
import BoardsPage from '@/pages/Boards';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/boards" replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [{ path: '/boards', element: <BoardsPage /> }],
      },
    ],
  },
  {
    element: <EmptyLayout />,
    children: [{ path: '*', element: <NotFoundPage /> }],
  },
]);
