
import React from 'react';
import { useToast } from '../components/feedback/Toast';
import { logger } from '../utils/logger';

/**
 * Error boundary context for accessing error state and functions
 */
const ErrorBoundaryContext = React.createContext(null);

/**
 * Hook to access error boundary context
 */
export function useErrorBoundary() {
  const context = React.useContext(ErrorBoundaryContext);
  if (context === undefined) {
    throw new Error('useErrorBoundary must be used within an ErrorBoundaryProvider');
  }
  return context;
}

/**
 * Error boundary component that catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundaryFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      errorStack: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      errorInfo,
      errorStack: error.stack
    });

    // Log the error
    logger.error('Uncaught error in component', { 
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorStack: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-red-100 p-3 mr-4">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
            </div>

            <div className="mt-4">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                The application has encountered an unexpected error. Our team has been notified 
                and we're working to fix the issue. You can try to:
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh the page
                </button>

                <button
                  onClick={this.resetError}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Try again
                </button>

                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go to homepage
                </button>
              </div>

              {/* Development mode only: Show detailed error */}
              {process.env.NODE_ENV !== 'production' && (
                <details className="mt-6 border-t border-gray-200 pt-4">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                    Show error details (development only)
                  </summary>
                  <div className="mt-2 p-4 bg-gray-800 text-gray-100 rounded overflow-auto max-h-96">
                    <p className="font-mono text-xs whitespace-pre-wrap">
                      {this.state.errorStack || this.state.error?.toString()}
                    </p>
                    {this.state.errorInfo?.componentStack && (
                      <div className="mt-4">
                        <p className="font-semibold text-xs text-gray-400">Component Stack:</p>
                        <p className="font-mono text-xs whitespace-pre-wrap">{this.state.errorInfo.componentStack}</p>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error handling provider component with toast notifications
 */
export function ErrorBoundaryProvider({ children }) {
  const toast = useToast();

  // Function to handle caught errors
  const handleError = (error) => {
    logger.error('Error caught by error handler', { error: error.message });

    toast.error('An error occurred', { 
      message: 'Please try again or contact support if the problem persists.',
      duration: 8000
    });
  };

  // Context value
  const contextValue = {
    handleError,
  };

  return (
    <ErrorBoundaryContext.Provider value={contextValue}>
      <ErrorBoundaryFallback onError={handleError}>
        {children}
      </ErrorBoundaryFallback>
    </ErrorBoundaryContext.Provider>
  );
}

/**
 * Custom hook for safely executing async functions with error handling
 * @param {Function} asyncFunction - The async function to execute
 * @param {Object} options - Options object
 * @returns {Array} [execute, { data, loading, error }]
 */
export function useSafeAsync(asyncFunction, options = {}) {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const { handleError } = useErrorBoundary();
  const toast = useToast();

  const execute = useCallback(
    async (...args) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const data = await asyncFunction(...args);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        setState({ data: null, loading: false, error });

        // Log the error
        logger.error('Error in async function', { error: error.message });

        // Handle error with error boundary
        handleError(error);

        // Show toast if enabled
        if (options.showToast !== false) {
          toast.error(options.errorMessage || 'An error occurred', {
            message: error.message || 'Please try again later',
            duration: options.toastDuration || 5000,
          });
        }

        // Rethrow if not handled
        if (options.throwError !== false) {
          throw error;
        }
      }
    },
    [asyncFunction, handleError, toast, options]
  );

  return [execute, state];
}
