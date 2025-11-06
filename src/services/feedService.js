// src/services/feedService.js

import api from './api';
import { ENDPOINTS } from '../config/constants';

/**
 * Servicio para manejar todas las operaciones relacionadas con el feed
 */
class FeedService {
  
  /**
   * Obtener feed personalizado
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.limit - Número de videos a obtener (default: 20)
   * @param {number} params.page - Página actual (default: 1)
   * @returns {Promise} - Lista de videos
   */
  async getFeed(params = {}) {
    try {
      const { limit = 20, page = 1 } = params;
      
      const response = await api.get(ENDPOINTS.FEED, {
        params: { limit, page },
      });
      
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return this.handleError(error, 'getFeed');
    }
  }

  /**
   * Obtener videos trending
   * @param {number} limit - Número de videos
   * @returns {Promise}
   */
  async getTrending(limit = 20) {
    try {
      const response = await api.get(ENDPOINTS.FEED_TRENDING, {
        params: { limit },
      });
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return this.handleError(error, 'getTrending');
    }
  }

  /**
   * Obtener videos de restaurantes cercanos
   * @param {Object} location - Coordenadas
   * @param {number} location.latitude
   * @param {number} location.longitude
   * @param {number} radius - Radio en kilómetros (default: 10)
   * @returns {Promise}
   */
  async getNearby(location, radius = 10) {
    try {
      const response = await api.get(ENDPOINTS.FEED_NEARBY, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          radius,
        },
      });
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return this.handleError(error, 'getNearby');
    }
  }

  /**
   * Registrar vista de video
   * @param {string} videoId
   * @param {Object} data
   * @param {number} data.watchTime - Tiempo visto en segundos
   * @param {boolean} data.completed - Si vió el video completo
   * @returns {Promise}
   */
  async recordView(videoId, data) {
    try {
      const response = await api.post(ENDPOINTS.VIDEO_VIEW(videoId), data);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return this.handleError(error, 'recordView');
    }
  }

  /**
   * Dar like a un video
   * @param {string} videoId
   * @returns {Promise}
   */
  async likeVideo(videoId) {
    try {
      const response = await api.post(ENDPOINTS.VIDEO_LIKE(videoId));
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return this.handleError(error, 'likeVideo');
    }
  }

  /**
   * Quitar like de un video
   * @param {string} videoId
   * @returns {Promise}
   */
  async unlikeVideo(videoId) {
    try {
      const response = await api.delete(ENDPOINTS.VIDEO_LIKE(videoId));
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return this.handleError(error, 'unlikeVideo');
    }
  }

  /**
   * Guardar video en favoritos
   * @param {string} videoId
   * @returns {Promise}
   */
  async addFavorite(videoId) {
    try {
      const response = await api.post(ENDPOINTS.VIDEO_FAVORITE(videoId));
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return this.handleError(error, 'addFavorite');
    }
  }

  /**
   * Quitar de favoritos
   * @param {string} videoId
   * @returns {Promise}
   */
  async removeFavorite(videoId) {
    try {
      const response = await api.delete(ENDPOINTS.VIDEO_FAVORITE(videoId));
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      return this.handleError(error, 'removeFavorite');
    }
  }

  /**
   * Registrar click en botón de pedido
   * @param {string} videoId
   * @param {string} platform - 'uber', 'didi', 'rappi'
   * @returns {Promise}
   */
  async recordOrderClick(videoId, platform) {
    try {
      const response = await api.post(ENDPOINTS.VIDEO_CLICK_ORDER(videoId), {
        platform,
      });
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return this.handleError(error, 'recordOrderClick');
    }
  }

  /**
   * Manejo centralizado de errores
   * @private
   */
  handleError(error, methodName) {
    console.error(`Error en FeedService.${methodName}:`, error);
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Error desconocido',
      statusCode: error.response?.status,
    };
  }
}

// Exportar instancia única (singleton)
export default new FeedService();