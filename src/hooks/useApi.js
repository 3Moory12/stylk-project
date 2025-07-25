
/**
 * Hook for making API requests with state management
 */

import { useState, useEffect, useCallback } from 'react';
import { api, ApiStatus, ErrorType } from '../api/client';
import { useCleanup } from './useCleanup';
import { logger } from '../utils/logger';

/**
 * Custom hook for making API requests with state management
 * 
 * @param {Object} options - Hook options
 * @param {Function} options.apiCall - Function that returns an API promise
 * @param {boolean} options.loadOnMount - Whether to load data on mount
 * @param {Array} options.dependencies - Dependencies to watch for reloading
 * @param {Function} options.onSuccess - Callback for successful responses
 * @param {Function} options.onError - Callback for error responses
 * @param {Object} options.initialData - Initial data state
 * @returns {Object} API state and methods
 */
export function useApi({
  apiCall,
  loadOnMount = false,
  dependencies = [],
  onSuccess,
  onError,
  initialData = null,
}) {
  // State for data, loading, and error
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create an AbortController for canceling requests
  const [controller, setController] = useState(null);

  // Function to execute the API call
  const execute = useCallback(async (...args) => {
    // If a request is already in progress, cancel it
    if (controller) {
      controller.abort();
    }

    // Create a new AbortController
    const newController = api.createAbortController();
    setController(newController);

    try {
      // Set loading state
      setLoading(true);
      setError(null);

      // Call the API with the abort signal
      const options = args[args.length - 1];
      const isOptionsObject = options && typeof options === 'object' && !Array.isArray(options);

      // Append the signal to the options if it's an object
      const apiCallArgs = isOptionsObject
        ? [...args.slice(0, -1), { ...options, signal: newController.signal }]
        : [...args, { signal: newController.signal }];

      // Execute the API call
      const response = await apiCall(...apiCallArgs);

      // Handle success
      setData(response.data);
      setLoading(false);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response.data, response);
      }

      return response;
    } catch (err) {
      // Don't update state if the request was canceled
      if (err.type === ErrorType.CANCELED) {
        return { status: ApiStatus.CANCELED };
      }

      // Handle error
      setError(err);
      setLoading(false);

      // Call onError callback if provided
      if (onError) {
        onError(err);
      } else {
        // Log the error if no custom handler
        logger.error('API request failed', { error: err });
      }

      throw err;
    } finally {
      // Clear the controller reference if it's the current one
      setController(c => (c === newController ? null : c));
    }
  }, [apiCall, controller, onSuccess, onError]);

  // Load data on mount if specified
  useEffect(() => {
    if (loadOnMount) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadOnMount, ...dependencies]);

  // Cleanup function to abort any pending requests
  useCleanup(() => {
    if (controller) {
      controller.abort();
    }
  }, [controller]);

  // Reset state
  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
    if (controller) {
      controller.abort();
      setController(null);
    }
  }, [initialData, controller]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for making GET requests
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options and useApi options
 * @returns {Object} API state and methods
 */
export function useApiGet(endpoint, options = {}) {
  const {
    params,
    loadOnMount = true,
    ...restOptions
  } = options;

  // Create the API call function
  const apiCall = useCallback(
    (callParams = params) => api.get(endpoint, { params: callParams }),
    [endpoint, params]
  );

  return useApi({
    apiCall,
    loadOnMount,
    dependencies: [endpoint, JSON.stringify(params)],
    ...restOptions,
  });
}

/**
 * Hook for making POST requests
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options and useApi options
 * @returns {Object} API state and methods
 */
export function useApiPost(endpoint, options = {}) {
  // Create the API call function
  const apiCall = useCallback(
    (data, callOptions) => api.post(endpoint, data, callOptions),
    [endpoint]
  );

  return useApi({
    apiCall,
    loadOnMount: false,
    ...options,
  });
}

/**
 * Hook for making PUT requests
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options and useApi options
 * @returns {Object} API state and methods
 */
export function useApiPut(endpoint, options = {}) {
  // Create the API call function
  const apiCall = useCallback(
    (data, callOptions) => api.put(endpoint, data, callOptions),
    [endpoint]
  );

  return useApi({
    apiCall,
    loadOnMount: false,
    ...options,
  });
}

/**
 * Hook for making DELETE requests
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options and useApi options
 * @returns {Object} API state and methods
 */
export function useApiDelete(endpoint, options = {}) {
  // Create the API call function
  const apiCall = useCallback(
    (callOptions) => api.delete(endpoint, callOptions),
    [endpoint]
  );

  return useApi({
    apiCall,
    loadOnMount: false,
    ...options,
  });
}
