
/**
 * Application Logger
 * 
 * A centralized logging system that supports multiple environments and log levels.
 * In development, logs are sent to the console.
 * In production, critical logs are sent to monitoring services.
 */

// Log levels
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

// Current log level based on environment
const currentLogLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO;

// Log level priority
const logLevelPriority = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

/**
 * Check if a log at the given level should be processed
 * @param {string} level - The log level to check
 * @returns {boolean} - Whether the log should be processed
 */
function shouldLog(level) {
  return logLevelPriority[level] >= logLevelPriority[currentLogLevel];
}

/**
 * Format the log message with metadata
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} [meta] - Additional metadata
 * @returns {Object} - Formatted log object
 */
function formatLog(level, message, meta = {}) {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
    environment: import.meta.env.MODE,
  };
}

/**
 * Send log to appropriate destination based on environment
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} [meta] - Additional metadata
 */
function sendLog(level, message, meta) {
  const formattedLog = formatLog(level, message, meta);

  // Development: Console logging
  if (import.meta.env.DEV) {
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(message, meta);
        break;
      case LogLevel.INFO:
        console.info(message, meta);
        break;
      case LogLevel.WARN:
        console.warn(message, meta);
        break;
      case LogLevel.ERROR:
        console.error(message, meta);
        break;
      default:
        console.log(message, meta);
    }
    return;
  }

  // Production: Send to monitoring service
  if (level === LogLevel.ERROR) {
    // Integration with Sentry for error logs
    import('@sentry/react').then(({ captureMessage, Severity }) => {
      captureMessage(message, {
        level: Severity.Error,
        extra: meta,
      });
    });
  }
}

/**
 * Logger instance with methods for different log levels
 */
export const logger = {
  debug: (message, meta = {}) => {
    if (shouldLog(LogLevel.DEBUG)) {
      sendLog(LogLevel.DEBUG, message, meta);
    }
  },

  info: (message, meta = {}) => {
    if (shouldLog(LogLevel.INFO)) {
      sendLog(LogLevel.INFO, message, meta);
    }
  },

  warn: (message, meta = {}) => {
    if (shouldLog(LogLevel.WARN)) {
      sendLog(LogLevel.WARN, message, meta);
    }
  },

  error: (message, meta = {}) => {
    if (shouldLog(LogLevel.ERROR)) {
      sendLog(LogLevel.ERROR, message, meta);
    }
  },

  // Track performance metrics
  performance: (label, duration) => {
    sendLog(LogLevel.INFO, `Performance: ${label}`, { 
      type: 'performance', 
      duration,
      label,
    });

    // Report to Web Vitals if relevant
    if (import.meta.env.PROD) {
      import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
        getCLS(console.log);
        getFID(console.log);
        getLCP(console.log);
      });
    }
  },
};
