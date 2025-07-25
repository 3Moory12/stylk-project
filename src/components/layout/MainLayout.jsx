
import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useAppStore } from '../../stores/appStore';
import Container from './Container';
import Button from '../atoms/Button';

/**
 * Main application layout with navigation
 */
export default function MainLayout() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useAppStore();

  // Navigation items - adjust based on auth state
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    ...(isAuthenticated
      ? [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Profile', path: '/profile' },
        ]
      : [])
  ];

  // Active link style
  const activeLinkClass = 'text-blue-600 font-medium';
  const normalLinkClass = 'text-gray-600 hover:text-blue-600';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <Container>
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                Stylk Project
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? activeLinkClass : normalLinkClass
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Auth buttons */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Dark mode' : 'Light mode'}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>

              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex overflow-x-auto py-2 -mx-4 px-4 space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `whitespace-nowrap ${isActive ? activeLinkClass : normalLinkClass}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </Container>
      </header>

      {/* Main content */}
      <main className="flex-grow py-6">
        <Container>
          <Outlet />
        </Container>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Stylk Project. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Contact
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
