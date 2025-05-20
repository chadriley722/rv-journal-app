import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (response?.status === 403) {
      toast.error('Access denied');
    } else if (response?.data?.message) {
      toast.error(response.data.message);
    } else {
      toast.error('An error occurred');
    }
    
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: (url: string, config?: any) => api.get(url, config),
  post: (url: string, data?: any, config?: any) => api.post(url, data, config),
  put: (url: string, data?: any, config?: any) => api.put(url, data, config),
  delete: (url: string, config?: any) => api.delete(url, config),
};

export const withErrorHandling = async <T>(
  promise: Promise<T>,
  successMessage?: string,
  errorMessage?: string
): Promise<T> => {
  try {
    const result = await promise;
    if (successMessage) {
      toast.success(successMessage);
    }
    return result;
  } catch (error) {
    if (errorMessage) {
      toast.error(errorMessage);
    }
    throw error;
  }
};
