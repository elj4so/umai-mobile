import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  navigation: StackNavigationProp<AuthStackParamList, 'Startup2'>;
};

export default function StartupScreen2({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AuthHeader />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>UMAI</Text>
        {/* Botón Iniciar sesión */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Iniciar sesión"
            mode="solid"
            onPress={() => navigation.navigate('Login')}
          />
          {/* Botón Registrarse*/}
          <CustomButton
            title="Registrarse"
            mode="outlined"
            onPress={() => navigation.navigate('RegisterType')}
          />
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
    justifyContent: 'center', // Centra el contenido verticalmente
    padding: 24,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 60, // Espacio entre el título y los botones
  },
  buttonContainer: {
    width: '100%',
  },
});