// src/screens/LoginScreen.tsx

import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

// Servicios
import authService from '../services/authService';

// Navegación
import { AuthStackParamList } from '../navigation/AppNavigator';
// Estilos Colores
import { COLORS } from '../constants/colors';
// Componentes
import WaveHeader from '../components/WaveHeader';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

// Props de Navegación
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Validación simple
  const isFormValid = email.includes('@') && password.length >= 6;

  // Lógica Iniciar Sesión
  const handleLogin = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Por favor completa todos los campos correctamente');
      return;
    }

    setLoading(true);
    
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        console.log('✅ Login exitoso:', result.data.user);
        
        // Mostrar mensaje de bienvenida
        Alert.alert(
          '¡Bienvenido!',
          `Hola ${result.data.user.name}`,
          [
            {
              text: 'Continuar',
              onPress: () => navigation.navigate('VideoReel'),
            },
          ]
        );
      } else {
        // Mostrar error específico del backend
        Alert.alert('Error al iniciar sesión', result.error);
      }
    } catch (error) {
      console.error('Error inesperado en login:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WaveHeader />
      <TouchableOpacity 
        onPress={() => navigation.navigate('Startup2')} 
        style={styles.backButton}
        disabled={loading}
      >
        <Feather name="arrow-left" size={28} color={COLORS.white} />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>UMAI</Text>
          <Text style={styles.subtitle}>Iniciar Sesión</Text>
        </View>
        
        <View style={styles.inputContainer}>
          {/* 1. Input: Correo Electrónico */}
          <CustomInput
            iconName="mail"
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          {/* 2. Input: Contraseña */}
          <CustomInput
            iconName="lock"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            isPassword={true}
            editable={!loading}
          />
        </View>
      </View>
      
      {/* Botón Iniciar Sesión */}
      <View style={styles.bottomContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Iniciando sesión...</Text>
          </View>
        ) : (
          <CustomButton
            title="Iniciar Sesión"
            mode="solid"
            onPress={handleLogin}
            disabled={!isFormValid}
          />
        )}
        
        <View style={styles.footerContainer}>
          <Text style={styles.registerLink}>¿No tienes una cuenta?</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('RegisterType')}
            disabled={loading}
          >
            <Text style={styles.registerLinkBold}> Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.white 
  },
  backButton: { 
    position: 'absolute', 
    top: 50,
    left: 20, 
    zIndex: 100
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 40,
  },
  titleContainer: { 
    alignItems: 'center', 
    marginTop: 85 
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 80
  },
  bottomContainer: { 
    padding: 24, 
    paddingTop: 0 
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerLink: { 
    fontSize: 16, 
    color: COLORS.textSecondary, 
    textAlign: 'center', 
    marginTop: 16 
  },
  registerLinkBold: { 
    fontSize: 16,
    color: COLORS.primary, 
    textAlign: 'center', 
    marginTop: 16,
    fontWeight: 'bold'
  },
});