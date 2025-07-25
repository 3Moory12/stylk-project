
/**
 * Validation utilities for form validation
 */

/**
 * Check if a value is empty (null, undefined, empty string, or empty array)
 * @param {any} value - Value to check
 * @returns {boolean} True if empty, false otherwise
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Validate an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidEmail(email) {
  if (isEmpty(email)) return false;

  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Validate a password meets minimum requirements
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @param {number} [options.minLength=8] - Minimum password length
 * @param {boolean} [options.requireLowercase=true] - Require at least one lowercase letter
 * @param {boolean} [options.requireUppercase=true] - Require at least one uppercase letter
 * @param {boolean} [options.requireNumbers=true] - Require at least one number
 * @param {boolean} [options.requireSpecial=false] - Require at least one special character
 * @returns {Object} Validation result with isValid flag and errors array
 */
export function validatePassword(password, options = {}) {
  const {
    minLength = 8,
    requireLowercase = true,
    requireUppercase = true,
    requireNumbers = true,
    requireSpecial = false,
  } = options;

  const errors = [];

  if (isEmpty(password)) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (requireSpecial && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a phone number
 * @param {string} phone - Phone number to validate
 * @param {string} [country='US'] - Country code for validation
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidPhone(phone, country = 'US') {
  if (isEmpty(phone)) return false;

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  switch (country) {
    case 'US':
      // US phone numbers are 10 digits
      return digitsOnly.length === 10;
    case 'UK':
      // UK phone numbers are typically 10-11 digits
      return digitsOnly.length >= 10 && digitsOnly.length <= 11;
    case 'IN':
      // India phone numbers are typically 10 digits
      return digitsOnly.length === 10;
    case 'CN':
      // China phone numbers are typically 11 digits
      return digitsOnly.length === 11;
    default:
      // Default check for international numbers (at least 7 digits)
      return digitsOnly.length >= 7;
  }
}

/**
 * Validate a URL
 * @param {string} url - URL to validate
 * @param {boolean} [requireProtocol=true] - Whether to require http/https protocol
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidURL(url, requireProtocol = true) {
  if (isEmpty(url)) return false;

  try {
    // Add protocol if not present and not required
    const urlToCheck = (!requireProtocol && !/^https?:\/\//i.test(url)) 
      ? `http://${url}` 
      : url;

    const urlObj = new URL(urlToCheck);
    return requireProtocol 
      ? /^https?:/.test(urlObj.protocol) 
      : true;
  } catch (err) {
    return false;
  }
}

/**
 * Validate form data against a schema
 * @param {Object} data - Form data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result with isValid flag and errors object
 */
export function validateForm(data, schema) {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Apply each rule to the field
    for (const rule of rules) {
      const { validator, message } = rule;

      // Skip validation if the field is not required and empty
      if (!rule.required && isEmpty(value)) {
        continue;
      }

      // If the rule has a required flag and the field is empty
      if (rule.required && isEmpty(value)) {
        errors[field] = rule.requiredMessage || 'This field is required';
        isValid = false;
        break;
      }

      // Run the validator function
      if (validator && !validator(value, data)) {
        errors[field] = message || 'Invalid value';
        isValid = false;
        break;
      }
    }
  }

  return { isValid, errors };
}
