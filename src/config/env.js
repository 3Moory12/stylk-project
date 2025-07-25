
/**
 * Environment configuration
 * 
 * Manages access to environment variables in a secure and type-safe way.
 * Validates required variables and provides sensible defaults when possible.
 */

/**
 * Get an environment variable with validation and default value
 * 
 * @param {string} key - The environment variable name
 * @param {any} defaultValue - Default value if not set
 * @param {boolean} required - Whether this variable is required
 * @returns {string|undefined} The environment variable value
 */
function getEnvVar(key, defaultValue = undefined, required = false) {
  const value = import.meta.env[key];

  if (value === undefined || value === '') {
    if (required) {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return defaultValue;
  }

  return value;
}

/**
 * Application environment configuration
 */
export const env = {
  // Application
  NODE_ENV: getEnvVar('MODE', 'development'),
  isProd: getEnvVar('MODE', 'development') === 'production',
  isDev: getEnvVar('MODE', 'development') === 'development',
  isTest: getEnvVar('MODE', 'development') === 'test',

  // API Configuration
  API_URL: getEnvVar('VITE_API_URL', 'http://localhost:3001/api', true),
  API_TIMEOUT: parseInt(getEnvVar('VITE_API_TIMEOUT', '10000'), 10),

  // Authentication
  AUTH_TOKEN_NAME: getEnvVar('VITE_AUTH_TOKEN_NAME', 'auth_token'),
  AUTH_TOKEN_EXPIRY: parseInt(getEnvVar('VITE_AUTH_TOKEN_EXPIRY', '86400'), 10), // 1 day in seconds

  // Monitoring
  SENTRY_DSN: getEnvVar('VITE_SENTRY_DSN', ''),
  SENTRY_ENABLED: getEnvVar('VITE_SENTRY_ENABLED', 'false') === 'true',

  // Feature flags
  FEATURE_NEW_DASHBOARD: getEnvVar('VITE_FEATURE_NEW_DASHBOARD', 'false') === 'true',

  // Rate limiting
  RATE_LIMIT_MAX: parseInt(getEnvVar('VITE_RATE_LIMIT_MAX', '100'), 10),
  RATE_LIMIT_WINDOW_MS: parseInt(getEnvVar('VITE_RATE_LIMIT_WINDOW_MS', '900000'), 10), // 15 minutes

  // Analytics
  ANALYTICS_ID: getEnvVar('VITE_ANALYTICS_ID', ''),
  ANALYTICS_ENABLED: getEnvVar('VITE_ANALYTICS_ENABLED', 'false') === 'true',
};

/**
 * Validate that all required environment variables are set
 */
export function validateEnv() {
  // Force validation of required environment variables
  Object.keys(env).forEach(key => {
    // Access each property to trigger the required validation
    const value = env[key];
    if (value === undefined) {
      console.warn(`Environment variable ${key} is not set. Using default value.`);
    }
  });

  console.log(`Environment loaded: ${env.NODE_ENV}`);
}
