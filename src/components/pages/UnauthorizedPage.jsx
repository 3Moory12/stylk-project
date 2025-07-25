
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

/**
 * Unauthorized access page
 * Displayed when a user tries to access a page they don't have permission for
 */
export default function UnauthorizedPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-4">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>

        <div className="bg-red-50 rounded-md p-4 mb-6">
          <p className="text-lg text-red-700">
            You don't have permission to access this page.
          </p>
        </div>

        <p className="text-gray-600 mb-8">
          {isAuthenticated ? (
            <>
              You are signed in as <strong>{user?.name || 'a user'}</strong> but you need additional permissions to view this page. 
              Please contact your administrator if you believe you should have access.
            </>
          ) : (
            <>
              Please sign in with an account that has the required permissions to access this page.
            </>
          )}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Homepage
          </Link>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
