import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, ENDPOINTS } from '../config/constants';

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para requests
    this.api.interceptors.request.use(
      async (config) => {
        console.log(`Request: ${config.method.toUpperCase()} ${config.url}`);
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('Error Request:', error.message);
        return Promise.reject(error);
      }
    );

    // Interceptor para responses
    this.api.interceptors.response.use(
      (response) => {
        console.log(`Response: ${response.config.url} ${response.status}`);
        return response;
      },
      async (error) => {
        if (error.code === 'ECONNABORTED') {
          console.error('Timeout: El servidor tardó demasiado');
          throw new Error('El servidor está tardando mucho. Puede estar despertando (Render tarda ~50 segundos).');
        }
        
        if (error.message === 'Network Error') {
          console.error('Error de red');
          throw new Error('No se pudo conectar al servidor. Verifica tu conexión a internet.');
        }

        console.error('Error Response:', error.response?.status, error.message);
        
        if (error.response?.status === 401) {
          await this.logout();
        }
        
        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      const response = await this.api.post(ENDPOINTS.LOGIN, {
        email,
        password,
      });

      console.log('Response login:', JSON.stringify(response.data, null, 2));

      const { data } = response;
      
      // Guardar tokens - ADAPTAR según tu respuesta del backend
      if (data.data?.tokens) {
        await AsyncStorage.setItem('accessToken', data.data.tokens.accessToken);
        await AsyncStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      }
      
      // Guardar usuario
      if (data.data?.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      console.error('Error en AuthService.login:', error);
      
      if (error.response) {
        const errorMsg = error.response.data?.message || 'Credenciales incorrectas';
        throw new Error(errorMsg);
      } else if (error.request) {
        throw new Error('No se pudo conectar al servidor. Verifica tu conexión.');
      } else {
        throw new Error(error.message || 'Error desconocido');
      }
    }
  }

  async register(userData) {
    try {
      const response = await this.api.post(ENDPOINTS.REGISTER, userData);
      
      console.log('Response register:', JSON.stringify(response.data, null, 2));

      const { data } = response;
      
      // Guardar tokens después del registro
      if (data.data?.tokens) {
        await AsyncStorage.setItem('accessToken', data.data.tokens.accessToken);
        await AsyncStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      }
      
      if (data.data?.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      console.error('Error en AuthService.register:', error);
      
      if (error.response) {
        const errorMsg = error.response.data?.message || 'Error al registrarse';
        throw new Error(errorMsg);
      } else if (error.request) {
        throw new Error('No se pudo conectar al servidor. Verifica tu conexión.');
      } else {
        throw new Error(error.message || 'Error desconocido');
      }
    }
  }

  async logout() {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
  }

  async getUser() {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  async isAuthenticated() {
    const token = await AsyncStorage.getItem('accessToken');
    return !!token;
  }
}

export default new AuthService();