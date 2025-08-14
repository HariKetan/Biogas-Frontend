import axios from 'axios';
import Cookies from 'js-cookie';
import { API_ENDPOINTS, STORAGE_KEYS } from '@lib/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://172.105.33.238:3500',
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      Cookies.remove(STORAGE_KEYS.TOKEN);
      Cookies.remove(STORAGE_KEYS.USER_ID);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service methods
export const authService = {
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  authenticate: async () => {
    const response = await api.get(API_ENDPOINTS.AUTHENTICATE);
    return response.data;
  },

  logout: () => {
    Cookies.remove(STORAGE_KEYS.TOKEN);
    Cookies.remove(STORAGE_KEYS.USER_ID);
  },
};

export const sensorService = {
  getSensorData: async (deviceId, params = {}) => {
    const response = await api.get(`${API_ENDPOINTS.SENSOR_DATA}/${deviceId}`, { params });
    return response.data;
  },

  getAllSensorData: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.SENSOR_DATA, { params });
    return response.data;
  },
};

export const deviceService = {
  getDevices: async () => {
    const response = await api.get(API_ENDPOINTS.DEVICES);
    return response.data;
  },

  createDevice: async (deviceData) => {
    const response = await api.post(API_ENDPOINTS.DEVICES, deviceData);
    return response.data;
  },

  updateDevice: async (deviceId, deviceData) => {
    const response = await api.put(`${API_ENDPOINTS.DEVICES}/${deviceId}`, deviceData);
    return response.data;
  },

  deleteDevice: async (deviceId) => {
    const response = await api.delete(`${API_ENDPOINTS.DEVICES}/${deviceId}`);
    return response.data;
  },
};

export const userService = {
  getUsers: async () => {
    const response = await api.get(API_ENDPOINTS.USERS);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post(API_ENDPOINTS.USERS, userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`${API_ENDPOINTS.USERS}/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`${API_ENDPOINTS.USERS}/${userId}`);
    return response.data;
  },
};

export default api;
