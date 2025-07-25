
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logger } from '../utils/logger';

/**
 * Main application store using Zustand
 * Implements:
 * - Persistence
 * - Logging middleware
 * - Type safety with JSDoc
 */

/**
 * @typedef {Object} AppState
 * @property {boolean} isLoading - Global loading state
 * @property {string|null} error - Global error message
 * @property {Object} user - User information
 * @property {string|null} user.id - User ID
 * @property {string|null} user.name - User name
 * @property {string|null} theme - UI theme (light/dark)
 */

/**
 * @typedef {Object} AppActions
 * @property {function} setLoading - Set loading state
 * @property {function} setError - Set error message
 * @property {function} clearError - Clear error message
 * @property {function} setUser - Set user information
 * @property {function} logout - Clear user information
 * @property {function} setTheme - Set UI theme
 * @property {function} toggleTheme - Toggle between light/dark theme
 */

/**
 * Logging middleware for Zustand
 */
const log = (config) => (set, get, api) => config(
  (...args) => {
    const prevState = get();
    set(...args);
    const nextState = get();
    logger.debug('State updated', { 
      prev: prevState,
      next: nextState,
      action: args[1]?.type || 'unknown'
    });
  },
  get,
  api
);

/**
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<AppState & AppActions>>}
 */
export const useAppStore = create(
  log(
    persist(
      (set) => ({
        // Initial state
        isLoading: false,
        error: null,
        user: {
          id: null,
          name: null,
        },
        theme: 'light',

        // Actions
        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => {
          if (error) {
            logger.error(error);
          }
          set({ error });
        },

        clearError: () => set({ error: null }),

        setUser: (user) => set({ user }),

        logout: () => set({ 
          user: { id: null, name: null }
        }),

        setTheme: (theme) => set({ theme }),

        toggleTheme: () => set((state) => ({ 
          theme: state.theme === 'light' ? 'dark' : 'light'
        })),
      }),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ 
          user: state.user,
          theme: state.theme
        }),
      }
    )
  )
);

// Export individual selectors for better performance
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
export const useUser = () => useAppStore((state) => state.user);
export const useTheme = () => useAppStore((state) => state.theme);
