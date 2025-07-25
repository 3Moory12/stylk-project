
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

// Toast types
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Toast type styles
const toastTypeStyles = {
  [TOAST_TYPES.SUCCESS]: {
    containerClass: 'bg-green-50 border-green-200',
    iconClass: 'text-green-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Success',
  },
  [TOAST_TYPES.ERROR]: {
    containerClass: 'bg-red-50 border-red-200',
    iconClass: 'text-red-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Error',
  },
  [TOAST_TYPES.INFO]: {
    containerClass: 'bg-blue-50 border-blue-200',
    iconClass: 'text-blue-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Information',
  },
  [TOAST_TYPES.WARNING]: {
    containerClass: 'bg-yellow-50 border-yellow-200',
    iconClass: 'text-yellow-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Warning',
  },
};

// Toast context
const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
});

/**
 * Individual Toast Component
 */
const Toast = ({ id, type = TOAST_TYPES.INFO, title, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Get styles based on toast type
  const typeStyles = toastTypeStyles[type] || toastTypeStyles[TOAST_TYPES.INFO];

  // Handle close
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose(id);
    }, 300); // Wait for animation to finish
  }, [id, onClose]);

  // Auto-close after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  return (
    <div 
      className={cn(
        'pointer-events-auto max-w-sm w-full rounded-lg shadow-lg border overflow-hidden transform transition-all',
        'transition duration-300 ease-in-out',
        typeStyles.containerClass,
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="p-4">
        <div className="flex items-start">
          {/* Icon */}
          <div className={cn('flex-shrink-0', typeStyles.iconClass)}>
            {typeStyles.icon}
          </div>

          {/* Content */}
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">
              {title || typeStyles.title}
            </p>
            {message && (
              <p className="mt-1 text-sm text-gray-500">
                {message}
              </p>
            )}
          </div>

          {/* Close button */}
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={handleClose}
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-1 w-full bg-gray-200">
          <div 
            className={cn(
              'h-full transition-all ease-linear',
              type === TOAST_TYPES.SUCCESS && 'bg-green-500',
              type === TOAST_TYPES.ERROR && 'bg-red-500',
              type === TOAST_TYPES.INFO && 'bg-blue-500',
              type === TOAST_TYPES.WARNING && 'bg-yellow-500'
            )}
            style={{ 
              width: '100%', 
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      )}

      <style jsx="true">{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

/**
 * Toast Container Component
 */
const ToastContainer = ({ toasts, onClose }) => {
  if (typeof window === 'undefined') {
    return null;
  }

  // Create portal to body to ensure toasts are shown above everything else
  return createPortal(
    <div className="fixed z-50 inset-0 pointer-events-none flex flex-col items-end sm:items-start px-4 py-6 space-y-4 sm:p-6">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>,
    document.body
  );
};

/**
 * Toast Provider Component
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Generate a unique ID for each toast
  const generateId = () => \`toast_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;

  // Show a toast notification
  const showToast = useCallback((options) => {
    const id = options.id || generateId();

    setToasts((currentToasts) => [
      ...currentToasts,
      { id, ...options }
    ]);

    return id;
  }, []);

  // Hide a toast notification by ID
  const hideToast = useCallback((id) => {
    setToasts((currentToasts) => 
      currentToasts.filter(toast => toast.id !== id)
    );
  }, []);

  // Context value
  const contextValue = {
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

/**
 * Hook to use the toast functionality
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    // Helper methods for common toast types
    success: (message, options = {}) => 
      context.showToast({ 
        type: TOAST_TYPES.SUCCESS, 
        message, 
        ...options 
      }),

    error: (message, options = {}) => 
      context.showToast({ 
        type: TOAST_TYPES.ERROR, 
        message, 
        ...options 
      }),

    info: (message, options = {}) => 
      context.showToast({ 
        type: TOAST_TYPES.INFO, 
        message, 
        ...options 
      }),

    warning: (message, options = {}) => 
      context.showToast({ 
        type: TOAST_TYPES.WARNING, 
        message, 
        ...options 
      }),

    // Base methods
    show: context.showToast,
    hide: context.hideToast,

    // Toast types constants
    TOAST_TYPES,
  };
}
