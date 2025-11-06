// src/config/constants.js

// ⚠️ IMPORTANTE: Reemplaza TU_IP_LOCAL con tu dirección IP real
// Ejemplo: const LOCAL_IP = '192.168.1.100';
const LOCAL_IP = '192.168.1.3'; // ⚠️ CAMBIA ESTO

const API_BASE_URL = __DEV__
  ? `http://${LOCAL_IP}:3000/api/v1` // Desarrollo local
  : 'https://tu-backend-en-produccion.com/api/v1'; // Producción

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000, // 10 segundos
};

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  
  // Feed
  FEED: '/feed',
  FEED_TRENDING: '/feed/trending',
  FEED_NEARBY: '/feed/nearby',
  
  // Videos
  VIDEOS: '/videos',
  VIDEO_LIKE: (id) => `/videos/${id}/like`,
  VIDEO_FAVORITE: (id) => `/videos/${id}/favorite`,
  VIDEO_VIEW: (id) => `/videos/${id}/view`,
  VIDEO_CLICK_ORDER: (id) => `/videos/${id}/click-order`,
  
  // User
  USER_PROFILE: '/users/profile',
  USER_FAVORITES: '/users/favorites',
  USER_LIKES: '/users/likes',
};

export default API_CONFIG;