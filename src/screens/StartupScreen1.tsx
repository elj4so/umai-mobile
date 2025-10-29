import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { COLORS } from '../constants/colors';

// Componentes
import AuthHeader from '../components/AuthHeader';
import CustomButton from '../components/CustomButton';

// Props de navegación
type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Startup1'>;
};

export default function StartupScreen1({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AuthHeader />
      
      <View style={styles.contentContainer}>
        {/* Contenido de arriba */}
        <View>
          <Text style={styles.title}>UMAI</Text>
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet consectetur. Lorem id sit
          </Text>
        </View>

        {/* Botón de abajo */}
        <CustomButton
          title="Continuar"
          mode="solid"
          onPress={() => navigation.navigate('Startup2')}
        />
      </View>
    </SafeAreaView>
  );
}

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