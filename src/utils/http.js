
/**
 * HTTP client with automatic error handling, retries, and request/response interceptors
 */

import { logger } from './logger';

// Default configuration
const DEFAULT_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  retries: 0,
  retryDelay: 1000,
  cache: false,
  credentials: 'same-origin',
};

// Error messages by status code
const ERROR_MESSAGES = {
  400: 'The request was invalid',
  401: 'Authentication required',
  403: 'You do not have permission to access this resource',
  404: 'The requested resource was not found',
  408: 'The request timed out',
  409: 'The request conflicted with another request',
  422: 'Validation error',
  429: 'Too many requests - please try again later',
  500: 'An error occurred on the server',
  502: 'Bad gateway',
  503: 'Service unavailable - please try again later',
  504: 'Gateway timeout',
};

// Request interceptors
const requestInterceptors = [];

// Response interceptors
const responseInterceptors = [];

// Error interceptors
const errorInterceptors = [];

/**
 * Add a request interceptor
 * @param {Function} interceptor - Function that receives and modifies the request config
 * @returns {Function} Function to remove the interceptor
 */
export function addRequestInterceptor(interceptor) {
  requestInterceptors.push(interceptor);

  return () => {
    const index = requestInterceptors.indexOf(interceptor);
    if (index !== -1) {
      requestInterceptors.splice(index, 1);
    }
  };
}

/**
 * Add a response interceptor
 * @param {Function} interceptor - Function that receives and modifies the response
 * @returns {Function} Function to remove the interceptor
 */
export function addResponseInterceptor(interceptor) {
  responseInterceptors.push(interceptor);

  return () => {
    const index = responseInterceptors.indexOf(interceptor);
    if (index !== -1) {
      responseInterceptors.splice(index, 1);
    }
  };
}

/**
 * Add an error interceptor
 * @param {Function} interceptor - Function that receives and handles errors
 * @returns {Function} Function to remove the interceptor
 */
export function addErrorInterceptor(interceptor) {
  errorInterceptors.push(interceptor);

  return () => {
    const index = errorInterceptors.indexOf(interceptor);
    if (index !== -1) {
      errorInterceptors.splice(index, 1);
    }
  };
}

/**
 * Create a custom API error
 */
export class ApiError extends Error {
  constructor(message, status, data = null, originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.originalError = originalError;
  }
}

/**
 * Process the response
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} Parsed response data
 */
async function processResponse(response) {
  const contentType = response.headers.get('Content-Type') || '';

  if (contentType.includes('application/json')) {
    const data = await response.json();
    return data;
  }

  if (contentType.includes('text/plain') || contentType.includes('text/html')) {
    return response.text();
  }

  if (contentType.includes('application/octet-stream')) {
    return response.blob();
  }

  return response;
}

/**
 * Apply request interceptors
 * @param {Object} config - Request configuration
 * @returns {Object} Modified configuration
 */
function applyRequestInterceptors(config) {
  return requestInterceptors.reduce(
    (currentConfig, interceptor) => interceptor(currentConfig),
    config
  );
}

/**
 * Apply response interceptors
 * @param {Object} response - Response object
 * @returns {Object} Modified response
 */
function applyResponseInterceptors(response) {
  return responseInterceptors.reduce(
    (currentResponse, interceptor) => interceptor(currentResponse),
    response
  );
}

/**
 * Apply error interceptors
 * @param {Error} error - Error object
 * @returns {Error} Modified error or null if handled
 */
function applyErrorInterceptors(error) {
  let currentError = error;

  for (const interceptor of errorInterceptors) {
    try {
      const result = interceptor(currentError);

      // If the interceptor returns null, the error was handled
      if (result === null) {
        return null;
      }

      // If the interceptor returns an error, use that error
      if (result instanceof Error) {
        currentError = result;
      }
    } catch (interceptorError) {
      logger.error('Error in error interceptor', { 
        error: interceptorError.message, 
        originalError: error.message 
      });
    }
  }

  return currentError;
}

/**
 * Create a custom HTTP client with the given configuration
 * @param {Object} customConfig - Custom configuration
 * @returns {Object} HTTP client
 */
export function createHttpClient(customConfig = {}) {
  // Merge default and custom configuration
  const config = { ...DEFAULT_CONFIG, ...customConfig };

  /**
   * Make a request with the HTTP client
   * @param {string} url - URL to request
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async function request(url, options = {}) {
    const requestUrl = url.startsWith('http') ? url : \`\${config.baseURL}\${url}\`;

    // Merge default and request options
    let requestConfig = {
      ...config,
      ...options,
      headers: {
        ...config.headers,
        ...options.headers,
      },
    };

    // Apply request interceptors
    requestConfig = applyRequestInterceptors(requestConfig);

    const { retries, retryDelay, ...fetchOptions } = requestConfig;

    // Use AbortController for timeout
    const controller = new AbortController();
    const { signal } = controller;

    // Set timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, fetchOptions.timeout || DEFAULT_CONFIG.timeout);

    // Log the request
    logger.debug('API Request', {
      url: requestUrl,
      method: fetchOptions.method || 'GET',
      headers: fetchOptions.headers,
    });

    // Retry logic
    let attempt = 0;
    let lastError;

    while (attempt <= retries) {
      try {
        const startTime = Date.now();

        // Make the request
        const response = await fetch(requestUrl, {
          ...fetchOptions,
          signal,
        });

        // Log the response time
        const duration = Date.now() - startTime;
        logger.debug('API Response', {
          url: requestUrl,
          status: response.status,
          duration: \`\${duration}ms\`,
        });

        // Process successful responses
        if (response.ok) {
          clearTimeout(timeoutId);
          const data = await processResponse(response);
          return applyResponseInterceptors({ data, status: response.status, headers: response.headers });
        }

        // Handle error responses
        const errorData = await processResponse(response).catch(() => null);

        // Create a custom error
        const errorMessage = 
          (errorData?.message) || 
          ERROR_MESSAGES[response.status] || 
          \`Request failed with status \${response.status}\`;

        const apiError = new ApiError(
          errorMessage,
          response.status,
          errorData
        );

        // If this is a non-retryable error, throw immediately
        if (
          response.status === 400 || // Bad request
          response.status === 401 || // Unauthorized
          response.status === 403 || // Forbidden
          response.status === 404 || // Not found
          response.status === 422    // Validation error
        ) {
          throw apiError;
        }

        // Otherwise, store for potential retry
        lastError = apiError;

      } catch (error) {
        // Handle aborted requests (timeout)
        if (error.name === 'AbortError') {
          lastError = new ApiError(
            'Request timed out',
            408,
            null,
            error
          );
        } 
        // Handle network errors
        else if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          lastError = new ApiError(
            'Network error - please check your connection',
            0,
            null,
            error
          );
        }
        // Use the existing error
        else {
          lastError = error;
        }

        // Log the error
        logger.error('API Error', {
          url: requestUrl,
          attempt: attempt + 1,
          error: lastError.message,
          status: lastError.status,
        });

        // If this is the last attempt, break
        if (attempt === retries) {
          break;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }

      attempt++;
    }

    // Clear the timeout
    clearTimeout(timeoutId);

    // Apply error interceptors
    const processedError = applyErrorInterceptors(lastError);

    // If all error interceptors handled the error, return null
    if (processedError === null) {
      return null;
    }

    // Otherwise, throw the processed error
    throw processedError;
  }

  // HTTP method helpers
  return {
    /**
     * Make a GET request
     * @param {string} url - URL to request
     * @param {Object} options - Request options
     * @returns {Promise<any>} Response data
     */
    get: (url, options = {}) => request(url, { ...options, method: 'GET' }),

    /**
     * Make a POST request
     * @param {string} url - URL to request
     * @param {any} data - Request data
     * @param {Object} options - Request options
     * @returns {Promise<any>} Response data
     */
    post: (url, data, options = {}) => request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

    /**
     * Make a PUT request
     * @param {string} url - URL to request
     * @param {any} data - Request data
     * @param {Object} options - Request options
     * @returns {Promise<any>} Response data
     */
    put: (url, data, options = {}) => request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

    /**
     * Make a PATCH request
     * @param {string} url - URL to request
     * @param {any} data - Request data
     * @param {Object} options - Request options
     * @returns {Promise<any>} Response data
     */
    patch: (url, data, options = {}) => request(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

    /**
     * Make a DELETE request
     * @param {string} url - URL to request
     * @param {Object} options - Request options
     * @returns {Promise<any>} Response data
     */
    delete: (url, options = {}) => request(url, {
      ...options,
      method: 'DELETE',
    }),

    /**
     * Make a raw request with full control
     * @param {string} url - URL to request
     * @param {Object} options - Request options
     * @returns {Promise<any>} Response data
     */
    request,
  };
}

// Create a default HTTP client
export const http = createHttpClient();

// Add an interceptor for authentication
addRequestInterceptor((config) => {
  // Get the authentication token from local storage
  const token = localStorage.getItem('auth_token');

  // If the token exists, add it to the headers
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: \`Bearer \${token}\`,
      },
    };
  }

  return config;
});

// Add a response interceptor for authentication errors
addResponseInterceptor((response) => {
  // Handle token refresh or other response modifications
  return response;
});

// Add an error interceptor for global error handling
addErrorInterceptor((error) => {
  // Handle 401 errors by redirecting to login
  if (error instanceof ApiError && error.status === 401) {
    // Check if we're not already on the login page
    if (!window.location.pathname.includes('/login')) {
      // Store the current URL to redirect back after login
      localStorage.setItem('auth_redirect', window.location.pathname);

      // Redirect to login page
      window.location.href = '/login';

      // Return null to indicate the error is handled
      return null;
    }
  }

  // Return the error to let it propagate
  return error;
});

// Export the ApiError and the default http client
export default http;
