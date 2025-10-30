import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

// Navegación
import { AuthStackParamList } from '../navigation/AppNavigator';
// Estilos Colores
import { COLORS } from '../constants/colors';
// Componentes
import AuthHeader from '../components/AuthHeader';
import CustomButton from '../components/CustomButton';

// Props de Navegación
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'RegisterType'>;
};

export default function RegisterTypeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TODO: Actualizar AuthHeader para que acepte un botón de "atrás" */}
      <AuthHeader />
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.title}>UMAI</Text>
          <Text style={styles.subtitle}>Registro</Text>
        </View>
        {/* Botón Cliente */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Cliente"
            mode="solid"
            onPress={() => navigation.navigate('RegisterClient')}
          />
          {/* Botón Restaurante */}
          <CustomButton
            title="Restaurante"
            mode="outlined"
            onPress={() => navigation.navigate('RegisterRestaurant')}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
           <Text style={styles.loginLink}> ¿Ya tienes una cuenta? <Text style={styles.loginLinkBold}>Inicia sesión</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
// Estilos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center', // Separa títulos, botones y link
    padding: 24,
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
    marginBottom: 60
  },
  buttonContainer: {
    width: '100%',
  },
  loginLink: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 60 
  },
  loginLinkBold: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});