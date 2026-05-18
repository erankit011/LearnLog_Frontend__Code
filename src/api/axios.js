import axios from 'axios';
import { toast } from 'react-toastify';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (envUrl) {
    return envUrl;
  }
  
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    return 'http://localhost:8585/api';
  }
  
  return `${window.location.origin}/api`;
};

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

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
  
  isRefreshing = false;
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;

      if (originalRequest.url?.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }

      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/verify-otp') ||
        originalRequest.url?.includes('/auth/resend-otp') ||
        originalRequest.url?.includes('/auth/forgot-password') ||
        originalRequest.url?.includes('/auth/reset-password')
      ) {
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        const baseURL = getApiUrl();
        const refreshTokenResponse = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
            timeout: 5000,
          }
        );

        if (refreshTokenResponse.data.success) {
          processQueue(null, refreshTokenResponse.data.data.accessToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        const isAuthPage = window.location.pathname === '/login' || 
                          window.location.pathname === '/register' ||
                          window.location.pathname === '/verify-otp' ||
                          window.location.pathname === '/forgot-password' ||
                          window.location.pathname.startsWith('/reset-password/');
        
        const skipAuthToast = originalRequest._skipAuthToast;
        
        if (!isAuthPage && !skipAuthToast) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';

    const isAuthPage = window.location.pathname === '/login' || 
                      window.location.pathname === '/register' ||
                      window.location.pathname === '/verify-otp' ||
                      window.location.pathname === '/forgot-password' ||
                      window.location.pathname.startsWith('/reset-password/');

    const isAuthEndpoint = 
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/current-user') ||
      originalRequest.url?.includes('/auth/verify-otp') ||
      originalRequest.url?.includes('/auth/resend-otp') ||
      originalRequest.url?.includes('/auth/refresh-token') ||
      originalRequest.url?.includes('/auth/forgot-password') ||
      originalRequest.url?.includes('/auth/reset-password');

    const shouldShowToast = !isAuthPage && !isAuthEndpoint && error.response?.status !== 429;

    if (shouldShowToast) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
