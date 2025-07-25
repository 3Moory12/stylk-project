
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../components/feedback/Toast';
import { authApi } from '../../services/api';
import { validatePassword } from '../../utils/validation';

/**
 * Reset Password page component
 * Allows users to set a new password using a reset token
 */
export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Validate token on mount
  useEffect(() => {
    const checkToken = async () => {
      try {
        // This would normally be an API call to verify the token
        // await authApi.verifyPasswordResetToken(token);
        setIsValidToken(true);
      } catch (error) {
        setIsValidToken(false);
        toast.error('Invalid or expired reset link', {
          message: 'Please request a new password reset link'
        });
      } finally {
        setTokenChecked(true);
      }
    };

    if (token) {
      checkToken();
    } else {
      setIsValidToken(false);
      setTokenChecked(true);
    }
  }, [token, toast]);

  // Form validation schema
  const validationSchema = {
    password: [
      { required: true, requiredMessage: 'New password is required' },
      { 
        validator: (value) => {
          const result = validatePassword(value);
          return result.isValid;
        },
        message: 'Password must be at least 8 characters with at least one letter and one number'
      }
    ],
    confirmPassword: [
      { required: true, requiredMessage: 'Please confirm your password' },
      {
        validator: (value, formData) => value === formData.password,
        message: 'Passwords do not match'
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
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: handleResetPassword,
  });

  // Handle form submission
  async function handleResetPassword(formData) {
    setIsSubmitting(true);

    try {
      await authApi.resetPassword({
        token,
        password: formData.password,
      });

      toast.success('Password reset successful');

      // Redirect to login page
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error('Failed to reset password', {
        message: error.message || 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show loading state while validating token
  if (!tokenChecked) {
    return (
      <Card>
        <div className="sm:mx-auto sm:w-full sm:max-w-md p-4">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-b-transparent border-blue-500 mb-4"></div>
            <p className="text-gray-600">Verifying your reset link...</p>
          </div>
        </div>
      </Card>
    );
  }

  // Show error if token is invalid
  if (!isValidToken) {
    return (
      <Card>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            Invalid Reset Link
          </h2>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg 
                  className="h-5 w-5 text-red-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  This password reset link is invalid or has expired.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Request a new reset link
            </Link>

            <div className="mt-4">
              <Link 
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Return to login
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Show form if token is valid
  return (
    <Card>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Set New Password
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="New password"
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={hasError('password') ? errors.password : undefined}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />

          <Input
            label="Confirm new password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={hasError('confirmPassword') ? errors.confirmPassword : undefined}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />

          <div className="text-sm text-gray-600 rounded-md bg-gray-50 p-3">
            <p>Your password must:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Be at least 8 characters long</li>
              <li>Include at least one letter and one number</li>
              <li>Not be a commonly used password</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            fullWidth 
            isLoading={isSubmitting}
          >
            Reset Password
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
      </div>
    </Card>
  );
}
