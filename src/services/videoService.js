import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, ENDPOINTS } from '../config/constants';

class VideoService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para respuestas
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado - redirigir a login
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        }
        return Promise.reject(error);
      }
    );
  }

  // Obtener feed personalizado
  async getFeed(page = 1, limit = 10) {
    try {
      const response = await this.api.get(ENDPOINTS.FEED, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error en VideoService.getFeed:', error);
      throw this.handleError(error);
    }
  }

  // Obtener videos en tendencia
  async getTrending(page = 1, limit = 10) {
    try {
      const response = await this.api.get(ENDPOINTS.FEED_TRENDING, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error en VideoService.getTrending:', error);
      throw this.handleError(error);
    }
  }

  // Obtener videos cercanos
  async getNearby(latitude, longitude, page = 1, limit = 10) {
    try {
      const response = await this.api.get(ENDPOINTS.FEED_NEARBY, {
        params: { latitude, longitude, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error en VideoService.getNearby:', error);
      throw this.handleError(error);
    }
  }

  // Dar like a un video
  async likeVideo(videoId) {
    try {
      const response = await this.api.post(ENDPOINTS.VIDEO_LIKE(videoId));
      return response.data;
    } catch (error) {
      console.error('Error en VideoService.likeVideo:', error);
      throw this.handleError(error);
    }
  }

  // Guardar video en favoritos
  async favoriteVideo(videoId) {
    try {
      const response = await this.api.post(ENDPOINTS.VIDEO_FAVORITE(videoId));
      return response.data;
    } catch (error) {
      console.error('Error en VideoService.favoriteVideo:', error);
      throw this.handleError(error);
    }
  }

  // Registrar vista de video
  async recordView(videoId) {
    try {
      const response = await this.api.post(ENDPOINTS.VIDEO_VIEW(videoId));
      return response.data;
    } catch (error) {
      console.error('Error en VideoService.recordView:', error);
      // No lanzar error aquí - las vistas son fire-and-forget
      return null;
    }
  }

  // Registrar click en botón de orden
  async recordOrderClick(videoId) {
    try {
      const response = await this.api.post(ENDPOINTS.VIDEO_CLICK_ORDER(videoId));
      return response.data;
    } catch (error) {
      console.error('Error en VideoService.recordOrderClick:', error);
      return null;
    }
  }

  // Manejo de errores centralizado
  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || 'Error del servidor';
      return new Error(message);
    } else if (error.request) {
      return new Error('No se pudo conectar al servidor. Verifica tu conexión.');
    } else {
      return new Error(error.message || 'Error desconocido');
    }
  }
}

export default new VideoService();