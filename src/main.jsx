import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import App from './App.jsx';
import './index.css';

// Create a simple placeholder for missing components
const SimpleSentryProvider = ({ children }) => <>{children}</>;

// Mock env and config for development
const env = {
  isProd: false,
  isDev: true,
  SENTRY_ENABLED: false
};

// Mock functions
const validateEnv = () => {
  console.log('Environment validation skipped');
};

const initSentry = () => {
  console.log('Sentry initialization skipped');
};

const initWebVitals = () => {
  console.log('Web vitals initialization skipped');
};

// Initialize environment
validateEnv();

// Add color scheme meta tag
const metaColorScheme = document.createElement('meta');
metaColorScheme.name = 'color-scheme';
metaColorScheme.content = 'light dark';
document.head.appendChild(metaColorScheme);

// Import providers
import { ToastProvider } from './components/feedback/Toast';
import { ModalProvider } from './components/feedback/Modal';
import { ErrorBoundaryProvider } from './providers/ErrorBoundary';

// Render application with providers
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimpleSentryProvider>
      <ToastProvider>
        <ErrorBoundaryProvider>
          <ThemeProvider>
            <ModalProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ModalProvider>
          </ThemeProvider>
        </ErrorBoundaryProvider>
      </ToastProvider>
    </SimpleSentryProvider>
  </React.StrictMode>
);
