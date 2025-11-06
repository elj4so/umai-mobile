// src/services/api.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/constants';

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token en cada request
api.interceptors.request.use(
  async (config) => {
    try {
      // Obtener token del storage
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      console.log('📤 Request:', config.method.toUpperCase(), config.url);
      return config;
    } catch (error) {
      console.error('Error en interceptor de request:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el token expiró (401) y no hemos reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Aquí podrías implementar refresh token
        // Por ahora, solo limpiamos el storage y redirigimos al login
        await AsyncStorage.removeItem('authToken');
        // Aquí podrías navegar al login screen
        // navigation.navigate('Login');
      } catch (err) {
        console.error('Error al manejar token expirado:', err);
      }
    }

    // Log del error
    if (error.response) {
      console.error('❌ Error Response:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('❌ Error Request:', error.message);
    } else {
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;