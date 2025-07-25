
import React, { createContext, useContext, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

// Create Theme Context
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

/**
 * Theme Provider component for managing application theme
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ThemeProvider({ children }) {
  // Get theme state from global store
  const { theme, toggleTheme, setTheme } = useAppStore(state => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
    setTheme: state.setTheme,
  }));

  // Update document classes when theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove old theme class
    root.classList.remove('light', 'dark');

    // Add new theme class
    root.classList.add(theme);

    // Update color scheme meta tag
    document.querySelector('meta[name="color-scheme"]')?.setAttribute(
      'content',
      theme === 'dark' ? 'dark' : 'light'
    );
  }, [theme]);

  // Check system preference on mount
  useEffect(() => {
    // Check if user has already set a preference
    const storedTheme = localStorage.getItem('app-storage');
    if (storedTheme) {
      try {
        const parsedStorage = JSON.parse(storedTheme);
        if (parsedStorage.state?.theme) {
          return; // Use the stored preference
        }
      } catch (e) {
        console.error('Error parsing stored theme', e);
      }
    }

    // Otherwise, check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  // Provide theme context to children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the theme context
 * @returns {Object} Theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
