
import React, { Suspense, lazy } from 'react';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

// Layouts
const MainLayout = lazy(() => import('../components/layout/MainLayout'));
const AuthLayout = lazy(() => import('../components/layout/AuthLayout'));

// Pages - Lazy loaded for code splitting
const HomePage = lazy(() => import('../components/pages/HomePage'));
const AboutPage = lazy(() => import('../components/pages/AboutPage'));
const DashboardPage = lazy(() => import('../components/pages/DashboardPage'));
const ProfilePage = lazy(() => import('../components/pages/ProfilePage'));
const LoginPage = lazy(() => import('../components/pages/LoginPage'));
const RegisterPage = lazy(() => import('../components/pages/RegisterPage'));
const NotFoundPage = lazy(() => import('../components/pages/NotFoundPage'));

// Loading component for suspense fallback
const PageLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Guest only route (redirects if already authenticated)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Routes configuration
const routes = [
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoading />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoading />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoading />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoading />}>
              <ProfilePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoading />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoading />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        path: 'login',
        element: (
          <GuestRoute>
            <Suspense fallback={<PageLoading />}>
              <LoginPage />
            </Suspense>
          </GuestRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestRoute>
            <Suspense fallback={<PageLoading />}>
              <RegisterPage />
            </Suspense>
          </GuestRoute>
        ),
      },
    ],
  },
];

// Create router
const router = createBrowserRouter(routes);

/**
 * Routes component with router provider
 */
export default function Routes() {
  return <RouterProvider router={router} />;
}
