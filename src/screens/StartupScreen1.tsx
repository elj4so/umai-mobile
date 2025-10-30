import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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
  navigation: StackNavigationProp<AuthStackParamList, 'Startup1'>;
};

export default function StartupScreen1({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AuthHeader />
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.title}>UMAI</Text>
          <Text style={styles.subtitle}> Lorem ipsum dolor sit amet consectetur. Lorem id sit </Text>
        </View>
        {/* Botón Continuar */}
        <CustomButton
          title="Continuar"
          mode="solid"
          onPress={() => navigation.navigate('Startup2')}
        />
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
    justifyContent: 'space-between', // Empuja el contenido arriba y el botón abajo
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center', // Centrado como en el mockup
    marginTop: 20, // Espacio desde la curva
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});