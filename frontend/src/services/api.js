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