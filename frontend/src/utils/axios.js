import axios from 'axios';
import { getStore, getAuthActions } from '../store/storeAccessor';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip auth header for refresh endpoint (it uses cookies)
    const isRefreshEndpoint = config.url?.includes('/auth/refresh');
    
    if (!isRefreshEndpoint) {
      try {
        const store = getStore();
        if (store) {
          const state = store.getState();
          const token = state.auth.token;

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        // Store not initialized yet, continue without token
        console.warn('Store not initialized, request will proceed without auth token');
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for the refresh endpoint itself and login/register endpoints
    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                          originalRequest.url?.includes('/auth/register');
    
    if (isRefreshEndpoint || isAuthEndpoint) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest._skipRefresh) {
      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh token - use plain axios to avoid interceptor loop
        const baseURL = import.meta.env.VITE_API_URL || '/api';
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { 
            withCredentials: true
          }
        );

        const { accessToken } = response.data.data;
        const store = getStore();
        const authActions = getAuthActions();
        
        if (store && authActions) {
          store.dispatch(authActions.setCredentials({ accessToken }));
        }

        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        isRefreshing = false;
        
        const store = getStore();
        const authActions = getAuthActions();
        
        if (store && authActions) {
          store.dispatch(authActions.clearAuth());
        }
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

