import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

// Navegación
import { AuthStackParamList } from '../navigation/AppNavigator';
// Estilos Colores
import { COLORS } from '../constants/colors';
// Componentes
import WaveHeader from '../components/WaveHeader';
import CustomButton from '../components/CustomButton';

// Props de Navegación
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'RegisterType'>;
};

export default function RegisterTypeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TODO: Actualizar WaveHeader para que acepte un botón de "atrás" */}
      <WaveHeader />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Feather name="arrow-left" size={28} color={COLORS.white} />
      </TouchableOpacity>
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
        </View>
        <View style={styles.footerContainer}>
          <Text style={styles.loginLink}> ¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkBold}> Inicia sesión </Text>
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
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    zIndex: 100
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
  footerContainer: {
    flexDirection: 'row', // Esto los pone uno al lado del otro
    justifyContent: 'center', // Centra el grupo
    alignItems: 'center', // Alinea verticalmente (por si un texto es más grande)
    marginTop: 16, // El margen que tenías en el loginLink
  },
  loginLink: { 
    fontSize: 16,
    color: COLORS.textSecondary, 
    textAlign: 'center', 
    marginTop: 16 
  },
  loginLinkBold: {
    fontSize: 16,
    color: COLORS.primary, 
    textAlign: 'center', 
    marginTop: 16,
    fontWeight: 'bold'
  },
});