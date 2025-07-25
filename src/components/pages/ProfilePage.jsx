
import React, { useState } from 'react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Card from '../molecules/Card';
import { useAuth } from '../../providers/AuthProvider';
import { logger } from '../../utils/logger';

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError('');
    setSuccess('');

    // Basic validation
    if (!name) {
      setError('Name is required');
      return;
    }

    if (!email) {
      setError('Email is required');
      return;
    }

    // Password validation (only if changing password)
    if (password) {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setIsLoading(true);

    try {
      // Simulating API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create updated profile object
      const updatedProfile = {
        name,
        email,
        bio,
        ...(password ? { password } : {}),
      };

      logger.info('Profile update', { userId: user?.id });

      // Update profile in auth context
      // await updateProfile(updatedProfile); // uncomment when API is ready

      // Refresh user profile
      await refreshProfile();

      setSuccess('Profile updated successfully');
    } catch (err) {
      logger.error('Profile update failed', { error: err.message });
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);

      // Clear password fields
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your account information and password.
        </p>
      </div>

      {/* Profile form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile info */}
        <div className="md:col-span-2">
          <Card>
            <Card.Title>Profile Information</Card.Title>

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-md">
                {success}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="mt-6 space-y-6">
              <Input
                label="Full name"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email address"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="A short bio about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="border-t border-gray-200 pt-5">
                <Card.Title>Change Password</Card.Title>
                <p className="text-sm text-gray-500 mt-1">
                  Leave blank if you don't want to change your password.
                </p>
              </div>

              <Input
                label="New password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

              <Input
                label="Confirm new password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />

              <div className="flex justify-end">
                <Button type="submit" isLoading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Profile sidebar */}
        <div>
          <Card>
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                {user?.name ? (
                  <span className="text-2xl font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                ) : (
                  <svg className="h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>

              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {user?.name || 'User'}
              </h3>

              <p className="text-sm text-gray-500">
                {user?.email || 'user@example.com'}
              </p>

              <div className="mt-6 w-full">
                <Button variant="outline" size="sm" fullWidth>
                  Upload Photo
                </Button>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500">Account</h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <Button variant="ghost" fullWidth className="justify-start">
                    Security Settings
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" fullWidth className="justify-start">
                    Notification Preferences
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" fullWidth className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                    Delete Account
                  </Button>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
