
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Card from '../molecules/Card';
import { useAuth } from '../../providers/AuthProvider';
import { logger } from '../../utils/logger';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError('');

    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      // Log the registration attempt (without sensitive data)
      logger.info('Registration attempt', { email });

      // Call the register function from auth provider
      await register({ name, email, password });

      // Redirect to dashboard after successful registration
      navigate('/dashboard');
    } catch (err) {
      logger.error('Registration failed', { error: err.message });
      setError(err.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <Card>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Create your account
        </h2>

        {/* Display error message if any */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Full name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            autoComplete="name"
            required
          />

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
            autoComplete="new-password"
            required
          />

          <Input
            label="Confirm password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button type="submit" fullWidth isLoading={false}>
            Sign up
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </div>
      </div>
    </Card>
  );
}
