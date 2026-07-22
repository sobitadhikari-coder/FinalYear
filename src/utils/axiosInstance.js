// src/utils/axiosInstance.js

import axios from 'axios';
import { API_BASE_URL } from './constants';
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from './token';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Attach access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 by attempting token refresh (direct call, no circular dependency)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error('No refresh token');

        // Direct call to refresh endpoint using global axios, not the instance
        const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
          refresh,
        });
        const { access, refresh: newRefresh } = response.data;

        setTokens(access, newRefresh);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.warn('Token refresh failed, redirecting to login.');
        removeTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;