
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApiPost } from '../hooks/useApi';
import { userService } from '../services/userService';
import { useAppStore } from '../stores/appStore';
import { logger } from '../utils/logger';

// Create Auth Context
const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshProfile: async () => {},
});

/**
 * Authentication Provider component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  // Get user from global store
  const { user, setUser, logout: logoutStore } = useAppStore(state => ({
    user: state.user,
    setUser: state.setUser,
    logout: state.logout,
  }));

  // Auth state
  const [isLoading, setIsLoading] = useState(true);

  // API hooks
  const loginApi = useApiPost('/auth/login');
  const registerApi = useApiPost('/auth/register');
  const profileApi = useApiPost('/users/profile');

  // Check if user is authenticated
  const isAuthenticated = Boolean(user?.id);

  /**
   * Login handler
   * @param {Object} credentials - Login credentials
   */
  const login = async (credentials) => {
    try {
      const response = await loginApi.execute(credentials);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      logger.error('Login failed', { error });
      throw error;
    }
  };

  /**
   * Register handler
   * @param {Object} userData - Registration data
   */
  const register = async (userData) => {
    try {
      const response = await registerApi.execute(userData);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      logger.error('Registration failed', { error });
      throw error;
    }
  };

  /**
   * Logout handler
   */
  const logout = () => {
    logoutStore();
  };

  /**
   * Refresh user profile
   */
  const refreshProfile = async () => {
    if (!isAuthenticated) return null;

    try {
      setIsLoading(true);
      const response = await userService.getProfile();
      setUser(response);
      return response;
    } catch (error) {
      logger.error('Failed to refresh profile', { error });
      // If we get a 401 error, the user's token is invalid
      if (error.statusCode === 401) {
        logout();
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check user authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        try {
          await refreshProfile();
        } catch (error) {
          // Handle error (already logged in refreshProfile)
        }
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prepare context value
  const contextValue = {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 * @returns {Object} Auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
