
/**
 * Web Vitals monitoring and reporting
 * 
 * Tracks Core Web Vitals metrics and reports them to analytics/monitoring services.
 * See: https://web.dev/vitals/
 */

import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';
import { logger } from './logger';
import { env } from '../config/env';

// Performance thresholds based on Core Web Vitals
const thresholds = {
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FID: { good: 100, poor: 300 },  // First Input Delay (ms)
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 }  // Time to First Byte (ms)
};

/**
 * Evaluate a metric against its thresholds
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @returns {'good'|'needs-improvement'|'poor'} Rating
 */
function getRating(name, value) {
  const threshold = thresholds[name];
  if (!threshold) return 'unknown';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report the metric to monitoring services
 * @param {Object} metric - The web-vitals metric object
 */
function reportMetric({ name, value, id, attribution }) {
  const rating = getRating(name, value);

  // Log to console in development
  if (env.isDev) {
    console.log(`[Web Vitals] ${name}: ${Math.round(value)} (${rating})`);
  }

  // Log to our centralized logger
  logger.performance(name, {
    value: Math.round(value),
    rating,
    id,
    attribution
  });

  // Report to Sentry if available
  if (env.SENTRY_ENABLED) {
    import('@sentry/react').then(({ captureMessage }) => {
      captureMessage(`WebVital: ${name}`, {
        level: rating === 'poor' ? 'warning' : 'info',
        extra: {
          value: Math.round(value),
          rating,
          id,
          attribution
        },
        tags: {
          metric_name: name,
          metric_rating: rating
        }
      });
    });
  }

  // Send to Google Analytics if configured
  if (env.ANALYTICS_ENABLED && window.gtag) {
    window.gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(value),
      non_interaction: true,
      metric_id: id,
      metric_name: name,
      metric_rating: rating,
    });
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals() {
  // Monitor Core Web Vitals
  onCLS(reportMetric);
  onFID(reportMetric);
  onLCP(reportMetric);

  // Monitor additional metrics
  onFCP(reportMetric);
  onTTFB(reportMetric);
}

/**
 * Get a summary of current performance metrics (for debugging)
 * @returns {Promise<Object>} Object containing available metrics
 */
export async function getPerformanceSummary() {
  return new Promise(resolve => {
    const metrics = {};
    let metricsRemaining = 5;

    function saveMetric(metric) {
      metrics[metric.name] = {
        value: Math.round(metric.value),
        rating: getRating(metric.name, metric.value)
      };

      metricsRemaining--;
      if (metricsRemaining <= 0) {
        resolve(metrics);
      }
    }

    // Get all metrics
    onCLS(saveMetric);
    onFID(saveMetric);
    onLCP(saveMetric);
    onFCP(saveMetric);
    onTTFB(saveMetric);

    // Resolve after a timeout in case some metrics aren't available
    setTimeout(() => {
      resolve(metrics);
    }, 3000);
  });
}
