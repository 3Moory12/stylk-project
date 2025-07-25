
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../components/feedback/Toast';
import { authApi } from '../../services/api';

/**
 * Forgot Password page component
 * Allows users to request a password reset link
 */
export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const toast = useToast();

  // Form validation schema
  const validationSchema = {
    email: [
      { 
        required: true, 
        requiredMessage: 'Email address is required' 
      },
      { 
        validator: (value) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value),
        message: 'Invalid email address format'
      }
    ]
  };

  // Initialize form
  const { 
    values, 
    errors, 
    handleChange, 
    handleBlur, 
    handleSubmit, 
    hasError,
  } = useForm({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: handleForgotPassword,
  });

  // Handle form submission
  async function handleForgotPassword(formData) {
    setIsSubmitting(true);

    try {
      await authApi.forgotPassword(formData);
      setSuccess(true);
      toast.success('Password reset link sent');
    } catch (error) {
      toast.error('Failed to send reset link', {
        message: error.message || 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Reset your password
        </h2>

        {success ? (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg 
                  className="h-5 w-5 text-green-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  We've sent you an email with instructions to reset your password.
                </p>
                <p className="mt-2 text-sm text-green-700">
                  Please check your email and follow the link to reset your password.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-blue-600 hover:text-blue-500">
                Return to login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-center text-gray-600 mb-6">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email address"
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={hasError('email') ? errors.email : undefined}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

              <Button 
                type="submit" 
                fullWidth 
                isLoading={isSubmitting}
              >
                Send Reset Link
              </Button>

              <div className="flex items-center justify-center">
                <Link 
                  to="/login"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </Card>
  );
}
