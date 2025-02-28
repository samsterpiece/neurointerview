// src/services/authService.js
import api from './api';

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/api/token/', credentials);

      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

      // Get user data
      const userResponse = await api.get('/api/users/me/');

      return {
        token: response.data.access,
        refresh_token: response.data.refresh,
        user: userResponse.data,
      };
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  },

  // Register user
  async register(userData) {
    try {
      // Create user
      const registerResponse = await api.post('/api/users/', userData);

      // Log in the new user
      const loginData = {
        username: userData.username,
        password: userData.password,
      };

      return await this.login(loginData);
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token');
      }

      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Get user data
      const response = await api.get('/api/users/me/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get user data');
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.patch('/api/users/me/', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Profile update failed');
    }
  },

  // Update user preferences
  async updatePreferences(preferences) {
    try {
      const response = await api.patch('/api/users/update_preferences/', preferences);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Preferences update failed');
    }
  },
};
