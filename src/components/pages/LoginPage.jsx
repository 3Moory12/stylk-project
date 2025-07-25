
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Card from '../molecules/Card';
import { useAuth } from '../../providers/AuthProvider';
import { logger } from '../../utils/logger';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the redirect path from the location state
  const from = location.state?.from?.pathname || '/dashboard';

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError('');

    // Basic validation
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      // Log the attempt (without sensitive data)
      logger.info('Login attempt', { email });

      // Call the login function from auth provider
      await login({ email, password });

      // Redirect to the intended page after successful login
      navigate(from, { replace: true });
    } catch (err) {
      logger.error('Login failed', { error: err.message });
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <Card>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Sign in to your account
        </h2>

        {/* Display error message if any */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        {/* Redirect message if the user was redirected to login */}
        {location.state?.from && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md">
            Please sign in to continue.
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <Button type="submit" fullWidth isLoading={false}>
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </div>
      </div>
    </Card>
  );
}
