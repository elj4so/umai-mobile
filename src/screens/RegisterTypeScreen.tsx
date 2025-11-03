import React, { useState } from 'react';
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
  const [umaiPosition, setUmaiPosition] = useState(55);

  const handleUmaiLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    setUmaiPosition(y);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WaveHeader targetY={umaiPosition} />
      <TouchableOpacity onPress={() => navigation.navigate('Startup2')} style={styles.backButton}>
        <Feather name="arrow-left" size={28} color={COLORS.white} />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text 
            style={styles.title}
            onLayout={handleUmaiLayout}
          >
            UMAI
          </Text>
          <Text style={styles.subtitle}>Registro</Text>
        </View>
        {/* Botones */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Cliente"
            mode="solid"
            onPress={() => navigation.navigate('RegisterClient')}
          />
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
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 40,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
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