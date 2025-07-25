
/**
 * Security middleware configuration
 * 
 * This module configures security headers and protections using Helmet.js and
 * implements rate limiting to prevent abuse.
 */

import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { logger } from '../utils/logger';

/**
 * Configure Helmet security headers
 * @returns {Function} Helmet middleware
 */
export const configureSecurityHeaders = () => {
  return helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Adjust based on your needs
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'", process.env.VITE_API_URL, 'https://*.sentry.io']
      }
    },
    // XSS Protection
    xssFilter: true,
    // Prevent MIME type sniffing
    noSniff: true,
    // Clickjacking protection
    frameguard: { action: 'deny' },
    // HSTS configuration
    hsts: {
      maxAge: 15552000, // 180 days
      includeSubDomains: true,
      preload: true
    },
    // Disable X-Powered-By header
    hidePoweredBy: true,
  });
};

/**
 * Create a rate limiter with the specified configuration
 * @param {Object} options - Rate limiter options
 * @returns {Function} Rate limiter middleware
 */
export const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', { 
        ip: req.ip,
        path: req.path 
      });

      res.status(429).json({
        error: 'Too many requests, please try again later.'
      });
    }
  };

  return rateLimit({
    ...defaultOptions,
    ...options
  });
};

/**
 * Configure API-specific rate limits
 * @returns {Object} Rate limiter middlewares for different routes
 */
export const configureRateLimits = () => {
  return {
    // General API rate limit
    api: createRateLimiter({
      windowMs: 15 * 60 * 1000,
      max: 100
    }),

    // Authentication endpoints (more strict)
    auth: createRateLimiter({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: 'Too many login attempts, please try again later'
    }),

    // Public endpoints (more lenient)
    public: createRateLimiter({
      windowMs: 15 * 60 * 1000,
      max: 500
    })
  };
};
