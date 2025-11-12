// URL del backend de Render
const API_BASE_URL = 'https://umai-backend-vqq6.onrender.com/api/v1';

console.log('API URL:', API_BASE_URL);

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 60000, // 60 segundos - Render puede tardar en despertar
};

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  FEED: '/feed',
  FEED_TRENDING: '/feed/trending',
  FEED_NEARBY: '/feed/nearby',
  VIDEOS: '/videos',
  VIDEO_LIKE: (id) => `/videos/${id}/like`,
  VIDEO_FAVORITE: (id) => `/videos/${id}/favorite`,
  VIDEO_VIEW: (id) => `/videos/${id}/view`,
  VIDEO_CLICK_ORDER: (id) => `/videos/${id}/click-order`,
  USER_PROFILE: '/users/profile',
  USER_FAVORITES: '/users/favorites',
  USER_LIKES: '/users/likes',
};

export default API_CONFIG;