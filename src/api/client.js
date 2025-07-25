
/**
 * API Client
 * 
 * A centralized API client for making HTTP requests with built-in:
 * - Error handling
 * - Authentication
 * - Request cancellation
 * - Retry logic
 * - Logging
 */

import { env } from '../config/env';
import { logger } from '../utils/logger';

/**
 * Default request options
 */
const DEFAULT_OPTIONS = {
  timeout: env.API_TIMEOUT || 10000,
  retries: 1,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * API response statuses
 */
export const ApiStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
  CANCELED: 'canceled',
};

/**
 * Error types for API errors
 */
export const ErrorType = {
  NETWORK: 'network',
  TIMEOUT: 'timeout',
  SERVER: 'server',
  AUTH: 'authentication',
  VALIDATION: 'validation',
  NOT_FOUND: 'not_found',
  CANCELED: 'canceled',
  UNKNOWN: 'unknown',
};

/**
 * Custom API error class
 */
export class ApiError extends Error {
  constructor(message, type, statusCode, data) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Map HTTP status codes to error types
 * @param {number} statusCode - HTTP status code
 * @returns {string} Error type
 */
function mapStatusToErrorType(statusCode) {
  if (statusCode >= 500) return ErrorType.SERVER;
  if (statusCode === 401 || statusCode === 403) return ErrorType.AUTH;
  if (statusCode === 404) return ErrorType.NOT_FOUND;
  if (statusCode === 422) return ErrorType.VALIDATION;
  return ErrorType.UNKNOWN;
}

/**
 * Check if a request should be retried
 * @param {Error} error - The error that occurred
 * @param {number} retryCount - Current retry count
 * @param {number} maxRetries - Maximum number of retries
 * @returns {boolean} Whether to retry the request
 */
function shouldRetry(error, retryCount, maxRetries) {
  // Don't retry if we've hit the max retries
  if (retryCount >= maxRetries) return false;

  // Don't retry certain error types
  if (
    error.type === ErrorType.AUTH ||
    error.type === ErrorType.VALIDATION ||
    error.type === ErrorType.CANCELED
  ) {
    return false;
  }

  // Retry network errors and server errors
  return (
    error.type === ErrorType.NETWORK ||
    error.type === ErrorType.TIMEOUT ||
    (error.type === ErrorType.SERVER && error.statusCode >= 500)
  );
}

/**
 * Calculate delay for exponential backoff
 * @param {number} retryCount - Current retry count
 * @returns {number} Delay in milliseconds
 */
function getRetryDelay(retryCount) {
  // Exponential backoff with jitter
  const baseDelay = 300; // ms
  const maxDelay = 3000; // ms
  const exponentialDelay = Math.min(
    maxDelay,
    baseDelay * Math.pow(2, retryCount)
  );

  // Add jitter (±20%)
  const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5);

  return exponentialDelay + jitter;
}

/**
 * Get authentication token from storage
 * @returns {string|null} Authentication token
 */
function getAuthToken() {
  try {
    const authStorage = localStorage.getItem('app-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed?.state?.user?.token || null;
    }
  } catch (e) {
    logger.error('Failed to get auth token', { error: e });
  }
  return null;
}

/**
 * Add authentication headers if token exists
 * @param {Object} headers - Request headers
 * @returns {Object} Headers with auth token if available
 */
function addAuthHeaders(headers = {}) {
  const token = getAuthToken();
  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return headers;
}

/**
 * Make an API request with fetch
 * 
 * @param {string} endpoint - API endpoint (path only)
 * @param {Object} options - Request options
 * @param {string} [options.method] - HTTP method
 * @param {Object} [options.body] - Request body
 * @param {Object} [options.headers] - Request headers
 * @param {boolean} [options.auth=true] - Whether to include auth headers
 * @param {number} [options.timeout] - Request timeout in ms
 * @param {number} [options.retries] - Number of retries for failed requests
 * @param {AbortSignal} [options.signal] - AbortController signal for cancellation
 * @returns {Promise<any>} Response data
 */
export async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = true,
    timeout = DEFAULT_OPTIONS.timeout,
    retries = DEFAULT_OPTIONS.retries,
    signal,
    ...restOptions
  } = options;

  // Current retry count
  let currentRetry = 0;

  // Create a new AbortController if one wasn't provided
  const controller = new AbortController();
  const requestSignal = signal || controller.signal;

  // Set up timeout
  const timeoutId = setTimeout(() => {
    controller.abort('timeout');
  }, timeout);

  // Function to execute request with retry logic
  async function executeRequest() {
    try {
      // Prepare headers
      const requestHeaders = {
        ...DEFAULT_OPTIONS.headers,
        ...headers,
        ...(auth ? addAuthHeaders(headers) : {}),
      };

      // Prepare request URL
      const url = `${env.API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

      // Log request
      logger.debug('API Request', {
        method,
        url,
        body: body ? '(present)' : undefined,
      });

      // Execute request
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: requestSignal,
        ...restOptions,
      });

      // Clear timeout
      clearTimeout(timeoutId);

      // Parse response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle error responses
      if (!response.ok) {
        const errorType = mapStatusToErrorType(response.status);
        const errorMessage = data?.message || response.statusText || 'API request failed';

        throw new ApiError(
          errorMessage,
          errorType,
          response.status,
          data
        );
      }

      // Log successful response
      logger.debug('API Response', {
        status: response.status,
        url,
      });

      // Return the data with metadata
      return {
        data,
        status: ApiStatus.SUCCESS,
        headers: Object.fromEntries(response.headers.entries()),
        statusCode: response.status,
      };
    } catch (error) {
      // Clear timeout
      clearTimeout(timeoutId);

      // Handle abort errors (timeout or cancellation)
      if (error.name === 'AbortError') {
        const isTimeout = error.message === 'timeout';
        const errorType = isTimeout ? ErrorType.TIMEOUT : ErrorType.CANCELED;
        const errorMessage = isTimeout ? 'Request timed out' : 'Request canceled';

        const apiError = new ApiError(
          errorMessage,
          errorType,
          0,
          { originalError: error }
        );

        // Don't retry timeout or canceled requests
        throw apiError;
      }

      // For API errors, check if we should retry
      if (error instanceof ApiError) {
        if (shouldRetry(error, currentRetry, retries)) {
          currentRetry++;
          const delay = getRetryDelay(currentRetry);

          logger.warn('Retrying API request', {
            url: endpoint,
            attempt: currentRetry,
            maxRetries: retries,
            delay,
          });

          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
          return executeRequest();
        }

        // No more retries, throw the error
        throw error;
      }

      // For network or other errors
      const apiError = new ApiError(
        error.message || 'Network error',
        ErrorType.NETWORK,
        0,
        { originalError: error }
      );

      if (shouldRetry(apiError, currentRetry, retries)) {
        currentRetry++;
        const delay = getRetryDelay(currentRetry);

        logger.warn('Retrying API request after network error', {
          url: endpoint,
          attempt: currentRetry,
          maxRetries: retries,
          delay,
        });

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        return executeRequest();
      }

      // Log the error
      logger.error('API request failed', {
        url: endpoint,
        error: apiError,
      });

      throw apiError;
    }
  }

  // Execute the request with retry logic
  return executeRequest();
}

/**
 * API client with methods for common HTTP verbs
 */
export const api = {
  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} [options] - Request options
   * @returns {Promise<any>} Response data
   */
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, { method: 'GET', ...options });
  },

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} [options] - Request options
   * @returns {Promise<any>} Response data
   */
  post: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, { method: 'POST', body: data, ...options });
  },

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} [options] - Request options
   * @returns {Promise<any>} Response data
   */
  put: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, { method: 'PUT', body: data, ...options });
  },

  /**
   * Make a PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @param {Object} [options] - Request options
   * @returns {Promise<any>} Response data
   */
  patch: (endpoint, data, options = {}) => {
    return apiRequest(endpoint, { method: 'PATCH', body: data, ...options });
  },

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} [options] - Request options
   * @returns {Promise<any>} Response data
   */
  delete: (endpoint, options = {}) => {
    return apiRequest(endpoint, { method: 'DELETE', ...options });
  },

  /**
   * Create an AbortController for request cancellation
   * @returns {AbortController} AbortController instance
   */
  createAbortController: () => {
    return new AbortController();
  },
};
