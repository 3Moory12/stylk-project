
/**
 * User Service
 * 
 * Handles all user-related API calls and data transformations.
 */

import { api } from '../api/client';

/**
 * User endpoints
 */
const endpoints = {
  login: '/auth/login',
  register: '/auth/register',
  profile: '/users/profile',
  updateProfile: '/users/profile',
  users: '/users',
};

/**
 * Login a user
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} User data with token
 */
export async function login(credentials) {
  const response = await api.post(endpoints.login, credentials);
  return response.data;
}

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @returns {Promise<Object>} User data with token
 */
export async function register(userData) {
  const response = await api.post(endpoints.register, userData);
  return response.data;
}

/**
 * Get the current user's profile
 * @returns {Promise<Object>} User profile data
 */
export async function getProfile() {
  const response = await api.get(endpoints.profile);
  return response.data;
}

/**
 * Update the current user's profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user profile
 */
export async function updateProfile(profileData) {
  const response = await api.put(endpoints.updateProfile, profileData);
  return response.data;
}

/**
 * Get a list of users (admin only)
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Paginated user list
 */
export async function getUsers(params = { page: 1, limit: 10 }) {
  const response = await api.get(endpoints.users, { params });
  return response.data;
}

/**
 * Get a specific user by ID (admin only)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
export async function getUserById(userId) {
  const response = await api.get(`${endpoints.users}/${userId}`);
  return response.data;
}

/**
 * Update a specific user (admin only)
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export async function updateUser(userId, userData) {
  const response = await api.put(`${endpoints.users}/${userId}`, userData);
  return response.data;
}

/**
 * Delete a user (admin only)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteUser(userId) {
  const response = await api.delete(`${endpoints.users}/${userId}`);
  return response.data;
}

/**
 * User service object with all user-related functions
 */
export const userService = {
  login,
  register,
  getProfile,
  updateProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
