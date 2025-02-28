// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
          // Validate token and get user data
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        // Clear invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const { token, refresh_token, user } = await authService.login(credentials);

      // Store tokens
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refresh_token);

      // Set the user in state
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const { token, refresh_token, user } = await authService.register(userData);

      // Store tokens
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refresh_token);

      // Set the user in state
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    // Clear user from state
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await authService.updatePreferences(preferences);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Preferences update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


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


// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // If no refresh token, logout
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          return Promise.reject(error);
        }

        // Try to get a new token
        const response = await axios.post('/api/token/refresh/', {
          refresh: refreshToken,
        });

        // Store new tokens
        localStorage.setItem('token', response.data.access);

        // Update auth header
        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;