
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import Button from '../atoms/Button';

/**
 * Layout for authentication pages (login, register, etc.)
 */
export default function AuthLayout() {
  const { theme, toggleTheme } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Stylk Project
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} Stylk Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
