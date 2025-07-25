
/**
 * Format utilities for consistent data presentation
 */

/**
 * Format a date string or timestamp into a localized date string
 * @param {string|number|Date} dateInput - Date input (ISO string, timestamp, or Date object)
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(dateInput, options = {}) {
  if (!dateInput) return '';

  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    // Default options
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    return new Intl.DateTimeFormat(
      navigator.language || 'en-US',
      { ...defaultOptions, ...options }
    ).format(date);
  } catch (err) {
    console.error('Date formatting error:', err);
    return String(dateInput);
  }
}

/**
 * Format a date to relative time (e.g., "2 hours ago", "yesterday")
 * @param {string|number|Date} dateInput - Date input (ISO string, timestamp, or Date object)
 * @returns {string} Relative time string
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return '';

  try {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
    } else if (diffMonth < 1) {
      const weeks = Math.floor(diffDay / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffMonth < 12) {
      return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;
    } else {
      return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
    }
  } catch (err) {
    console.error('Relative time formatting error:', err);
    return String(dateInput);
  }
}

/**
 * Format a number to a currency string
 * @param {number} value - Number to format
 * @param {string} [currency='USD'] - Currency code
 * @param {string} [locale] - Locale code (defaults to browser locale)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = 'USD', locale) {
  if (value === null || value === undefined) return '';

  try {
    return new Intl.NumberFormat(locale || navigator.language || 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (err) {
    console.error('Currency formatting error:', err);
    return String(value);
  }
}

/**
 * Format a number with thousands separators
 * @param {number} value - Number to format
 * @param {number} [decimals=0] - Number of decimal places
 * @param {string} [locale] - Locale code (defaults to browser locale)
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 0, locale) {
  if (value === null || value === undefined) return '';

  try {
    return new Intl.NumberFormat(locale || navigator.language || 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (err) {
    console.error('Number formatting error:', err);
    return String(value);
  }
}

/**
 * Format a file size into a human-readable string
 * @param {number} bytes - Size in bytes
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted file size string
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format a phone number according to a specific pattern
 * @param {string} phoneNumber - Phone number to format
 * @param {string} [pattern='(XXX) XXX-XXXX'] - Pattern to use for formatting
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phoneNumber, pattern = '(XXX) XXX-XXXX') {
  if (!phoneNumber) return '';

  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  let formattedNumber = pattern;
  let digitIndex = 0;

  // Replace X with digits from the phone number
  for (let i = 0; i < formattedNumber.length; i++) {
    if (formattedNumber[i] === 'X') {
      formattedNumber = 
        formattedNumber.substring(0, i) + 
        (digitIndex < digitsOnly.length ? digitsOnly[digitIndex] : 'X') + 
        formattedNumber.substring(i + 1);
      digitIndex++;
    }
  }

  // If pattern wasn't fully filled, return original digits
  if (formattedNumber.includes('X')) {
    return digitsOnly;
  }

  return formattedNumber;
}

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} [length=100] - Maximum length
 * @param {string} [ellipsis='...'] - Ellipsis string
 * @returns {string} Truncated text
 */
export function truncateText(text, length = 100, ellipsis = '...') {
  if (!text) return '';

  if (text.length <= length) {
    return text;
  }

  return text.substring(0, length - ellipsis.length) + ellipsis;
}
