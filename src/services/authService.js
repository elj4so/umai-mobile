// src/services/authService.js

import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINTS } from '../config/constants';

/**
 * Servicio para manejar autenticación
 */
class AuthService {
  
  /**
   * Iniciar sesión
   * @param {string} email
   * @param {string} password
   * @returns {Promise}
   */
  async login(email, password) {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, {
        email,
        password,
      });

      console.log('📦 Respuesta completa del login:', JSON.stringify(response.data, null, 2));

      // Acceder directamente a los datos sin destructuring anticipado
      const responseData = response.data;
      
      if (!responseData.success) {
        return {
          success: false,
          error: responseData.message || 'Error en el login',
        };
      }

      // Ahora sí extraer los datos
      const user = responseData.data?.user;
      const tokens = responseData.data?.tokens;

      if (!tokens || !user) {
        console.error('❌ Token o usuario no encontrados en la respuesta');
        console.error('Data recibida:', responseData.data);
        return {
          success: false,
          error: 'Respuesta del servidor inválida',
        };
      }

      const token = tokens.accessToken;
      const refreshToken = tokens.refreshToken;

      console.log('✅ Token obtenido:', token ? 'Sí' : 'No');
      console.log('✅ Usuario obtenido:', user ? user.name : 'No');
      
      // Guardar tokens en AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        data: {
          token,
          refreshToken,
          user,
        },
        message: responseData.message || 'Login exitoso',
      };
    } catch (error) {
      return this.handleError(error, 'login');
    }
  }

  /**
   * Registrar nuevo usuario (Cliente)
   * @param {Object} userData
   * @returns {Promise}
   */
  async registerCustomer(userData) {
    try {
      const { name, email, phone, password, preferences } = userData;
      
      const response = await api.post(ENDPOINTS.REGISTER, {
        name,
        email,
        phone,
        password,
        role: 'CUSTOMER',
        preferences: {
          cuisinePreferences: preferences || [],
        },
      });

      console.log('📦 Respuesta completa del registro:', JSON.stringify(response.data, null, 2));

      const responseData = response.data;
      
      if (!responseData.success) {
        return {
          success: false,
          error: responseData.message || 'Error en el registro',
        };
      }

      // Extraer los datos
      const user = responseData.data?.user;
      const tokens = responseData.data?.tokens;

      if (!tokens || !user) {
        console.error('❌ Token o usuario no encontrados en la respuesta');
        console.error('Data recibida:', responseData.data);
        return {
          success: false,
          error: 'Respuesta del servidor inválida',
        };
      }

      const token = tokens.accessToken;
      const refreshToken = tokens.refreshToken;

      console.log('✅ Token obtenido:', token ? 'Sí' : 'No');
      console.log('✅ Usuario obtenido:', user ? user.name : 'No');
      
      // Guardar tokens en AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        data: {
          token,
          refreshToken,
          user,
        },
        message: responseData.message || 'Registro exitoso',
      };
    } catch (error) {
      return this.handleError(error, 'registerCustomer');
    }
  }

  /**
   * Registrar nuevo restaurante
   * @param {Object} userData
   * @param {Object} restaurantData
   * @returns {Promise}
   */
  async registerRestaurant(userData, restaurantData) {
    try {
      const response = await api.post(ENDPOINTS.REGISTER, {
        ...userData,
        role: 'RESTAURANT',
        restaurantData,
      });

      const responseData = response.data;
      
      if (!responseData.success) {
        return {
          success: false,
          error: responseData.message || 'Error en el registro',
        };
      }

      const user = responseData.data?.user;
      const tokens = responseData.data?.tokens;

      if (!tokens || !user) {
        console.error('❌ Token o usuario no encontrados en la respuesta');
        return {
          success: false,
          error: 'Respuesta del servidor inválida',
        };
      }

      const token = tokens.accessToken;
      const refreshToken = tokens.refreshToken;
      
      // Guardar tokens en AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        data: {
          token,
          refreshToken,
          user,
        },
        message: responseData.message || 'Registro exitoso',
      };
    } catch (error) {
      return this.handleError(error, 'registerRestaurant');
    }
  }

  /**
   * Obtener usuario actual (verificar si está autenticado)
   * @returns {Promise}
   */
  async getCurrentUser() {
    try {
      const response = await api.get(ENDPOINTS.ME);
      
      const { success, data } = response.data;
      
      if (success && data) {
        // Actualizar usuario en storage
        await AsyncStorage.setItem('user', JSON.stringify(data));
        
        return {
          success: true,
          data,
        };
      }
      
      return {
        success: false,
        error: 'No se pudo obtener el usuario',
      };
    } catch (error) {
      return this.handleError(error, 'getCurrentUser');
    }
  }

  /**
   * Cerrar sesión
   * @returns {Promise}
   */
  async logout() {
    try {
      // Limpiar AsyncStorage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
      
      return {
        success: true,
        message: 'Sesión cerrada correctamente',
      };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return {
        success: false,
        error: 'Error al cerrar sesión',
      };
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener token guardado
   * @returns {Promise<string|null>}
   */
  async getToken() {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtener refresh token guardado
   * @returns {Promise<string|null>}
   */
  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem('refreshToken');
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtener usuario guardado
   * @returns {Promise<Object|null>}
   */
  async getStoredUser() {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Manejo centralizado de errores
   * @private
   */
  handleError(error, methodName) {
    console.error(`Error en AuthService.${methodName}:`, error);
    
    let errorMessage = 'Error desconocido';
    
    if (error.response) {
      // El servidor respondió con un error
      errorMessage = error.response.data?.message || error.response.data?.error || 'Error del servidor';
    } else if (error.request) {
      // No hubo respuesta del servidor
      errorMessage = 'No se pudo conectar con el servidor';
    } else {
      // Error en la configuración de la request
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
      statusCode: error.response?.status,
    };
  }
}

// Exportar instancia única (singleton)
export default new AuthService();