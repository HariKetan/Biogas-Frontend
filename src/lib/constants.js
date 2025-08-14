// Application constants
export const API_ENDPOINTS = {
  LOGIN: '/api/v1/login',
  AUTHENTICATE: '/api/v1/authenticate',
  SENSOR_DATA: '/api/v1/sensor-data',
  DEVICES: '/api/v1/devices',
  USERS: '/api/v1/users',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  DASHBOARD_APP: '/dashboard/app',
  SENSOR_VALUES: '/dashboard/sensor_values',
  SENSOR_VALUE_DETAIL: '/sensor-value/:device_id',
  NOT_FOUND: '/404',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_ID: 'uid',
  THEME: 'theme-preference',
};

export const CHART_COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
  SUCCESS: '#2e7d32',
  WARNING: '#ed6c02',
  ERROR: '#d32f2f',
  INFO: '#0288d1',
};

export const SENSOR_TYPES = {
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  PH: 'ph',
  METHANE: 'methane',
  WEIGHT: 'weight',
  VOLTAGE: 'voltage',
  CURRENT: 'current',
  POWER: 'power',
  ENERGY: 'energy',
  FREQUENCY: 'frequency',
};
