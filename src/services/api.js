
/**
 * API service layer for all API requests
 * This file centralizes all API endpoints and request logic
 */

import { http, ApiError, useApi } from '../utils/http';
import { logger } from '../utils/logger';

/**
 * Base API service with common methods
 */
class BaseApiService {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async get(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      return await http.get(url, options);
    } catch (error) {
      this.handleError(error, 'GET', endpoint);
      throw error;
    }
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async post(endpoint, data, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      return await http.post(url, data, options);
    } catch (error) {
      this.handleError(error, 'POST', endpoint);
      throw error;
    }
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async put(endpoint, data, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      return await http.put(url, data, options);
    } catch (error) {
      this.handleError(error, 'PUT', endpoint);
      throw error;
    }
  }

  /**
   * Make a PATCH request
   * @param {string} endpoint - API endpoint
   * @param {any} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async patch(endpoint, data, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      return await http.patch(url, data, options);
    } catch (error) {
      this.handleError(error, 'PATCH', endpoint);
      throw error;
    }
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async delete(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      return await http.delete(url, options);
    } catch (error) {
      this.handleError(error, 'DELETE', endpoint);
      throw error;
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   */
  handleError(error, method, endpoint) {
    if (error instanceof ApiError) {
      logger.error(`API Error [${method} ${endpoint}]`, {
        status: error.status,
        message: error.message,
        data: error.data,
      });
    } else {
      logger.error(`Unexpected API Error [${method} ${endpoint}]`, {
        message: error.message,
      });
    }
  }
}

/**
 * Authentication API service
 */
class AuthApi extends BaseApiService {
  constructor() {
    super('/auth');
  }

  /**
   * Log in a user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} User data and token
   */
  async login(credentials) {
    return this.post('/login', credentials);
  }

  /**
   * Register a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} User data
   */
  async register(userData) {
    return this.post('/register', userData);
  }

  /**
   * Log out the current user
   * @returns {Promise<void>}
   */
  async logout() {
    return this.post('/logout');
  }

  /**
   * Refresh the authentication token
   * @returns {Promise<Object>} New token data
   */
  async refreshToken() {
    return this.post('/refresh');
  }

  /**
   * Request a password reset
   * @param {Object} data - Request data
   * @param {string} data.email - User email
   * @returns {Promise<Object>} Success message
   */
  async forgotPassword(data) {
    return this.post('/forgot-password', data);
  }

  /**
   * Reset a password using a token
   * @param {Object} data - Reset data
   * @param {string} data.token - Reset token
   * @param {string} data.password - New password
   * @returns {Promise<Object>} Success message
   */
  async resetPassword(data) {
    return this.post('/reset-password', data);
  }

  /**
   * Verify a user's email address
   * @param {string} token - Verification token
   * @returns {Promise<Object>} Success message
   */
  async verifyEmail(token) {
    return this.get(`/verify-email/${token}`);
  }
}

/**
 * User API service
 */
class UserApi extends BaseApiService {
  constructor() {
    super('/users');
  }

  /**
   * Get the current user's profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    return this.get('/me');
  }

  /**
   * Update the current user's profile
   * @param {Object} data - Profile data to update
   * @returns {Promise<Object>} Updated user profile data
   */
  async updateProfile(data) {
    return this.put('/me', data);
  }

  /**
   * Change the current user's password
   * @param {Object} data - Password data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  async changePassword(data) {
    return this.post('/change-password', data);
  }

  /**
   * Update the current user's avatar
   * @param {FormData} formData - Form data with avatar file
   * @returns {Promise<Object>} Updated user profile data with avatar URL
   */
  async updateAvatar(formData) {
    return this.post('/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

/**
 * Products API service
 */
class ProductApi extends BaseApiService {
  constructor() {
    super('/products');
  }

  /**
   * Get a list of products
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} List of products with pagination metadata
   */
  async getProducts(params = {}) {
    return this.get('', {
      params,
    });
  }

  /**
   * Get a single product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product data
   */
  async getProduct(id) {
    return this.get(`/${id}`);
  }

  /**
   * Create a new product
   * @param {Object} data - Product data
   * @returns {Promise<Object>} Created product data
   */
  async createProduct(data) {
    return this.post('', data);
  }

  /**
   * Update a product
   * @param {string} id - Product ID
   * @param {Object} data - Product data to update
   * @returns {Promise<Object>} Updated product data
   */
  async updateProduct(id, data) {
    return this.put(`/${id}`, data);
  }

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Success message
   */
  async deleteProduct(id) {
    return this.delete(`/${id}`);
  }
}

// Export API service instances
export const authApi = new AuthApi();
export const userApi = new UserApi();
export const productApi = new ProductApi();

// Export hooks for each API endpoint
export const useAuthApi = () => ({
  login: useApi(authApi.login.bind(authApi)),
  register: useApi(authApi.register.bind(authApi)),
  logout: useApi(authApi.logout.bind(authApi)),
  refreshToken: useApi(authApi.refreshToken.bind(authApi)),
  forgotPassword: useApi(authApi.forgotPassword.bind(authApi)),
  resetPassword: useApi(authApi.resetPassword.bind(authApi)),
  verifyEmail: useApi(authApi.verifyEmail.bind(authApi)),
});

export const useUserApi = () => ({
  getProfile: useApi(userApi.getProfile.bind(userApi)),
  updateProfile: useApi(userApi.updateProfile.bind(userApi)),
  changePassword: useApi(userApi.changePassword.bind(userApi)),
  updateAvatar: useApi(userApi.updateAvatar.bind(userApi)),
});

export const useProductApi = () => ({
  getProducts: useApi(productApi.getProducts.bind(productApi)),
  getProduct: useApi(productApi.getProduct.bind(productApi)),
  createProduct: useApi(productApi.createProduct.bind(productApi)),
  updateProduct: useApi(productApi.updateProduct.bind(productApi)),
  deleteProduct: useApi(productApi.deleteProduct.bind(productApi)),
});
