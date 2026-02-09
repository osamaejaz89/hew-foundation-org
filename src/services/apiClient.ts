import axios, { AxiosInstance } from 'axios';

// Base URL must be [ip]:[port]/api so paths are /admin/families, /user/login, etc. (no /api in path)
const raw = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/?$/, '');
const baseURL = raw.endsWith('/api') ? raw : `${raw}/api`;

const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token and fix FormData uploads
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient; 