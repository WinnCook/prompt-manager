import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiError, ApiResponse } from '@/types/api';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth tokens, logging, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors, transform responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        message: error.response.data?.message || 'An error occurred',
        code: error.response.data?.code || 'UNKNOWN_ERROR',
        details: error.response.data?.details,
      };

      console.error('[API Error]', {
        status: error.response.status,
        url: error.config?.url,
        error: apiError,
      });

      return Promise.reject(apiError);
    } else if (error.request) {
      // Request made but no response received
      const networkError: ApiError = {
        message: 'Network error - unable to reach server',
        code: 'NETWORK_ERROR',
      };
      console.error('[Network Error]', error.request);
      return Promise.reject(networkError);
    } else {
      // Error in request setup
      const requestError: ApiError = {
        message: error.message || 'Request configuration error',
        code: 'REQUEST_ERROR',
      };
      console.error('[Request Error]', error.message);
      return Promise.reject(requestError);
    }
  }
);

// Helper function to wrap API calls with consistent error handling
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request<T>(config);
    return { data: response.data };
  } catch (error) {
    return { error: error as ApiError };
  }
}

// Convenience methods for common HTTP operations
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'GET', url }),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'POST', url, data }),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'PUT', url, data }),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'DELETE', url }),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'PATCH', url, data }),
};

export default apiClient;
