
import React from 'react';

// Mock Sentry implementation when package is not available
const mockSentry = {
  init: () => {},
  ErrorBoundary: ({ children }) => <>{children}</>,
};

// Check if we should enable Sentry
const isSentryEnabled = () => {
  try {
    return import.meta.env.VITE_SENTRY_ENABLED === 'true';
  } catch (e) {
    return false;
  }
};

// Initialize Sentry only if enabled
export function initSentry() {
  // Early return if Sentry is not enabled
  if (!isSentryEnabled()) {
    console.log('Sentry is disabled');
    return;
  }

  try {
    // Try to use window.Sentry if available (loaded via CDN)
    if (window.Sentry) {
      window.Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
          // Use built-in integrations if available
          window.Sentry.browserTracingIntegration && 
            window.Sentry.browserTracingIntegration({
              tracePropagationTargets: ["localhost", /^https:\/\/yourdomain\.com/],
            }),
          window.Sentry.replayIntegration && 
            window.Sentry.replayIntegration(),
        ].filter(Boolean),
        // Performance Monitoring
        tracesSampleRate: 1.0, // Lower in production
        // Session Replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        environment: import.meta.env.MODE,
      });
      console.log('Sentry initialized via window.Sentry');
    } else {
      console.log('Sentry not available');
    }
  } catch (e) {
    console.error('Failed to initialize Sentry:', e);
  }
}

export function SentryProvider({ children }) {
  // If Sentry is not available, just render children
  if (!isSentryEnabled() || !window.Sentry) {
    return <>{children}</>;
  }

  const Sentry = window.Sentry;

  return (
    <Sentry.ErrorBoundary 
      fallback={({ error, resetError }) => <ErrorFallback error={error} resetError={resetError} />}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

function ErrorFallback({ error, resetError }) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-red-50 rounded-lg shadow max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-700 mb-4">
          We've been notified about this issue and are working to fix it.
        </p>
        {error && (
          <div className="bg-red-100 p-3 rounded text-sm text-red-800 mb-4 overflow-auto max-h-32">
            {error.toString()}
          </div>
        )}
        <button
          onClick={() => {
            if (resetError) resetError();
            else window.location.reload();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
