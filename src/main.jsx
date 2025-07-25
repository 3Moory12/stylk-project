import React from 'react';
import ReactDOM from 'react-dom/client';
import { SentryProvider, initSentry } from './providers/SentryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import App from './App.jsx';
import './index.css';
import { initWebVitals } from './utils/webVitals';
import { validateEnv, env } from './config/env';

// Initialize environment
validateEnv();

// Initialize monitoring
if (env.SENTRY_ENABLED) {
  initSentry();
}

// Initialize web vitals monitoring
if (env.isProd) {
  initWebVitals();
}

// Add color scheme meta tag
const metaColorScheme = document.createElement('meta');
metaColorScheme.name = 'color-scheme';
metaColorScheme.content = 'light dark';
document.head.appendChild(metaColorScheme);

// Render application with providers
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SentryProvider>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </SentryProvider>
  </React.StrictMode>
);
